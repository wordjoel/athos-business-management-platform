const inbox = [];
const VERIFY_TOKEN = 'athos_verify_2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Webhook verification (WhatsApp Cloud API)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      return res.status(200).send(challenge);
    }

    // Return pending messages (polling from app)
    const contato = req.query.contato || '';
    const pendentes = contato
      ? inbox.filter(m => m.telefone === contato || m.contato === contato)
      : inbox;
    return res.status(200).json(pendentes);
  }

  // Receive incoming message (from WhatsApp Cloud API or n8n)
  if (req.method === 'POST') {
    const body = req.body || {};

    // WhatsApp Cloud API webhook payload
    if (body.entry) {
      const entries = body.entry || [];
      const messages = [];

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const msgs = value.messages || [];
          for (const msg of msgs) {
            const from = msg.from || '';
            const text = msg.text?.body || msg.text?.body || '';
            const name = value.contacts?.[0]?.profile?.name || from;

            const newMsg = {
              id: `wa-${msg.id || Date.now()}`,
              mensagem: text,
              contato: name,
              telefone: from,
              numeroUsuario: value.metadata?.display_phone_number || '',
              data: msg.timestamp
                ? new Date(parseInt(msg.timestamp) * 1000).toISOString()
                : new Date().toISOString(),
              lida: false,
            };
            messages.push(newMsg);
            inbox.push(newMsg);
          }
        }
      }

      if (messages.length > 0 && inbox.length > 200) {
        inbox.splice(0, inbox.length - 100);
      }

      return res.status(200).json({ status: 'ok' });
    }

    // Z-API webhook payload
    if (body.senderPhone || body.sender) {
      const zapiText = body.text?.message || body.text || body.message || '';
      const zapiFrom = body.senderPhone || body.sender || '';
      const zapiName = body.senderName || body.sender || zapiFrom;

      const msg = {
        id: `zapi-${body.messageId || Date.now()}`,
        mensagem: zapiText,
        contato: zapiName,
        telefone: zapiFrom,
        numeroUsuario: body.phone || '5511953992662',
        data: body.timestamp
          ? new Date(parseInt(body.timestamp) * 1000).toISOString()
          : new Date().toISOString(),
        lida: false,
      };
      inbox.push(msg);
      if (inbox.length > 200) inbox.splice(0, inbox.length - 100);
      return res.status(200).json({ status: 'ok', id: msg.id });
    }

    // Generic webhook (n8n or direct)
    const { mensagem, contato, telefone, numeroUsuario, timestamp } = body;

    if (!mensagem) {
      return res.status(400).json({ erro: 'Mensagem é obrigatória' });
    }

    const msg = {
      id: `n8n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mensagem,
      contato: contato || 'WhatsApp',
      telefone: telefone || '',
      numeroUsuario: numeroUsuario || '5511953992662',
      data: timestamp || new Date().toISOString(),
      lida: false,
    };

    inbox.push(msg);
    if (inbox.length > 200) inbox.splice(0, inbox.length - 100);

    return res.status(200).json({ status: 'ok', id: msg.id });
  }

  return res.status(405).json({ erro: 'Method not allowed' });
}
