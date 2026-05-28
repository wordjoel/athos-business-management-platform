const express = require('express');
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

const PORT = process.env.PORT || 3000;
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://athos-business-management-platform.vercel.app';
const WEBHOOK_URL = `${PLATFORM_URL}/api/webhook`;
const AUTH_DIR = path.join(__dirname, 'auth_info');
const NUMERO_USUARIO = process.env.NUMERO_USUARIO || '5511953992662';

global.recentMessages = [];
global.sock = null;
global.connectionState = 'disconnected';
global.lastQR = null;

async function startBot() {
  try {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`[Baileys] Versão: ${version.join('.')}`);

    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const sock = makeWASocket({
      version,
      browser: Browsers.windows('Chrome'),
      auth: state,
      logger: pino({ level: 'error' }),
      printQRInTerminal: true,
    generateHighQualityLink: true,
    syncFullHistory: false,
  });

  global.sock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      global.connectionState = 'qr';
      global.lastQR = qr;
      qrcode.generate(qr, { small: true });
      console.log('📱 ESCANEIE O QR CODE ACIMA para conectar o WhatsApp!');
    }

    if (connection === 'open') {
      global.connectionState = 'connected';
      console.log('✅ WhatsApp conectado com sucesso!');
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      global.connectionState = 'disconnected';
      console.log(`❌ Desconectado (motivo: ${reason || 'desconhecido'}). Reconectando em 5s...`);
      setTimeout(startBot, 5000);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (msg.key.fromMe) continue;
      if (!msg.message?.conversation && !msg.message?.extendedTextMessage?.text) continue;

      const text = msg.message.conversation || msg.message.extendedTextMessage.text;
      const from = msg.key.remoteJid.replace('@s.whatsapp.net', '');
      const pushName = msg.pushName || from;
      const msgId = msg.key.id;

      if (global.recentMessages.some(m => m.id === msgId)) continue;

      const entry = {
        id: `bridge-${msgId}-${Date.now()}`,
        mensagem: text,
        contato: pushName,
        telefone: from,
        numeroUsuario: NUMERO_USUARIO,
        data: new Date().toISOString(),
      };

      global.recentMessages.push(entry);
      if (global.recentMessages.length > 100) global.recentMessages.splice(0, 50);

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        console.log(`📩 Mensagem de ${pushName} (${from}): ${text.slice(0, 50)}`);
      } catch (err) {
        console.error('Erro ao enviar para webhook:', err.message);
      }
    }
  });
  } catch (err) {
    console.error('Erro ao iniciar WhatsApp:', err);
    setTimeout(startBot, 10000);
  }
}

app.get('/health', (req, res) => {
  res.json({
    status: global.connectionState,
    connected: global.connectionState === 'connected',
    contatos: global.sock ? 'ok' : 'no_session',
    hasQR: !!global.lastQR,
  });
});

app.get('/qr', (req, res) => {
  if (!global.lastQR) {
    return res.json({ qr: null, status: global.connectionState });
  }
  res.json({
    qr: global.lastQR,
    url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(global.lastQR)}`,
    status: global.connectionState,
  });
});

app.post('/send', async (req, res) => {
  const { telefone, mensagem } = req.body;

  if (!telefone || !mensagem) {
    return res.status(400).json({ erro: 'telefone e mensagem são obrigatórios' });
  }

  if (!global.sock) {
    return res.status(503).json({ erro: 'WhatsApp não conectado' });
  }

  try {
    const jid = telefone.includes('@s.whatsapp.net') ? telefone : `${telefone}@s.whatsapp.net`;
    await global.sock.sendMessage(jid, { text: mensagem });
    console.log(`📤 Mensagem enviada para ${telefone}: ${mensagem.slice(0, 50)}`);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (!body || !body.mensagem) {
    return res.status(400).json({ erro: 'mensagem é obrigatório' });
  }

  // Store for polling
  const entry = {
    id: `hook-${Date.now()}`,
    ...body,
  };

  global.recentMessages.push(entry);
  if (global.recentMessages.length > 100) global.recentMessages.splice(0, 50);

  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🤖 WhatsApp Bridge rodando na porta ${PORT}`);
  console.log(`🔗 Webhook: ${WEBHOOK_URL}`);
  console.log(`📱 Número do usuário: ${NUMERO_USUARIO}`);
  console.log(`⏱ Iniciando conexão WhatsApp...`);
  startBot();
});
