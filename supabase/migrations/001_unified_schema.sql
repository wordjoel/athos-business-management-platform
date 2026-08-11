-- ============================================
-- ATHOS BUSINESS MANAGEMENT PLATFORM
-- Unified Database Schema (Supabase)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. AUTH & USERS
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  avatar TEXT DEFAULT 'US',
  telefone TEXT,
  cargo TEXT,
  role TEXT NOT NULL DEFAULT 'visualizador' CHECK (role IN ('master', 'admin', 'gerente', 'supervisor', 'operador', 'financeiro', 'rh', 'comercial', 'juridico', 'cliente', 'visualizador')),
  permissions JSONB DEFAULT '["read"]',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FINANCEIRO
-- ============================================

CREATE TABLE IF NOT EXISTS lancamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT NOT NULL,
  contraparte TEXT,
  valor DECIMAL(12,2) NOT NULL,
  vencimento TEXT NOT NULL,
  data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'recebido', 'atrasado')),
  categoria TEXT NOT NULL DEFAULT 'Geral',
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contas_bancarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  banco TEXT NOT NULL,
  agencia TEXT NOT NULL,
  conta TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'investimento')),
  saldo_inicial DECIMAL(12,2) DEFAULT 0,
  saldo_atual DECIMAL(12,2) DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS extratos_bancarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conta_id UUID REFERENCES contas_bancarias(id),
  data TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('credito', 'debito')),
  categoria TEXT NOT NULL DEFAULT 'Geral',
  conciliado BOOLEAN DEFAULT false,
  lancamento_id UUID REFERENCES lancamentos(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pix_chaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
  valor TEXT NOT NULL,
  banco TEXT NOT NULL,
  conta TEXT NOT NULL,
  ativa BOOLEAN DEFAULT true,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pix_transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('enviada', 'recebida')),
  chave TEXT NOT NULL,
  chave_tipo TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  descricao TEXT,
  contraparte TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'concluida', 'falha')),
  data TEXT NOT NULL,
  hora TEXT NOT NULL,
  txid TEXT UNIQUE NOT NULL,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS boletos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sacado TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  vencimento TEXT NOT NULL,
  data_emissao TEXT NOT NULL,
  linha_digitavel TEXT NOT NULL,
  codigo_barras TEXT NOT NULL,
  carteira TEXT NOT NULL DEFAULT '109',
  nosso_numero TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado', 'baixado')),
  observacao TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cartoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  bandeira TEXT NOT NULL CHECK (bandeira IN ('visa', 'mastercard', 'elo', 'amex', 'outros')),
  ultimos4digitos TEXT NOT NULL,
  limite DECIMAL(12,2) NOT NULL,
  limite_disponivel DECIMAL(12,2) NOT NULL,
  fatura_atual DECIMAL(12,2) DEFAULT 0,
  dia_fechamento INTEGER NOT NULL,
  dia_vencimento INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'bloqueado', 'cancelado')),
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faturas_cartao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cartao_id UUID REFERENCES cartoes(id),
  mes TEXT NOT NULL,
  ano INTEGER NOT NULL,
  valor_total DECIMAL(12,2) DEFAULT 0,
  pago BOOLEAN DEFAULT false,
  data_pagamento TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transacoes_cartao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cartao_id UUID REFERENCES cartoes(id),
  fatura_id UUID REFERENCES faturas_cartao(id),
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  parcela_atual INTEGER,
  total_parcelas INTEGER,
  status TEXT NOT NULL DEFAULT 'processada' CHECK (status IN ('pendente', 'processada', 'estornada')),
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CRM
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  empresa TEXT,
  valor DECIMAL(12,2) DEFAULT 0,
  etapa TEXT NOT NULL DEFAULT 'novo' CHECK (etapa IN ('novo', 'contatado', 'qualificado', 'proposta', 'negociacao', 'fechado', 'perdido')),
  responsavel TEXT,
  ultimo_contato TEXT,
  notas TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  coluna TEXT NOT NULL DEFAULT 'backlog',
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  responsavel TEXT,
  data_limite TEXT,
  tags JSONB DEFAULT '[]',
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. PROJETOS
-- ============================================

CREATE TABLE IF NOT EXISTS projetos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado')),
  responsavel TEXT,
  data_inicio TEXT,
  data_fim TEXT,
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  orcamento DECIMAL(12,2),
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id UUID REFERENCES projetos(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  responsavel TEXT,
  data_limite TEXT,
  tipo TEXT DEFAULT 'task' CHECK (tipo IN ('epic', 'story', 'bug', 'task')),
  pontos INTEGER DEFAULT 0,
  epic_id UUID,
  sprint TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. RH
-- ============================================

CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT,
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  salario DECIMAL(12,2),
  data_admissao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'ferias', 'afastado', 'desligado')),
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SUPORTE
-- ============================================

CREATE TABLE IF NOT EXISTS chamados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('critica', 'alta', 'normal', 'baixa')),
  status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_atendimento', 'resolvido', 'fechado')),
  categoria TEXT NOT NULL DEFAULT 'geral',
  solicitante TEXT NOT NULL,
  responsavel TEXT,
  sla_horas INTEGER,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. DRIVE
-- ============================================

CREATE TABLE IF NOT EXISTS arquivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('projeto', 'contrato', 'documento', 'imagem', 'outro')),
  tamanho BIGINT NOT NULL,
  url TEXT,
  descricao TEXT,
  tags JSONB DEFAULT '[]',
  categoria TEXT NOT NULL DEFAULT 'Geral',
  uploaded_por TEXT NOT NULL,
  data_upload TEXT NOT NULL,
  versao_atual INTEGER DEFAULT 1,
  privado BOOLEAN DEFAULT false,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arquivo_versoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arquivo_id UUID REFERENCES arquivos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  data_upload TEXT NOT NULL,
  uploaded_por TEXT NOT NULL,
  tamanho BIGINT NOT NULL,
  changelog TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arquivo_permissoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arquivo_id UUID REFERENCES arquivos(id) ON DELETE CASCADE,
  usuario_email TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('visualizar', 'editar', 'admin')),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(arquivo_id, usuario_email)
);

-- ============================================
-- 8. CONTRATOS
-- ============================================

CREATE TABLE IF NOT EXISTS contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  parte TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  endereco TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('licenca', 'parceria', 'fornecimento', 'servico', 'outro')),
  categoria TEXT NOT NULL DEFAULT 'geral',
  valor DECIMAL(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativo', 'suspenso', 'encerrado', 'cancelado')),
  data_inicio TEXT,
  data_fim TEXT,
  observacoes TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. AI HUB
-- ============================================

CREATE TABLE IF NOT EXISTS ai_conversas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agente TEXT NOT NULL,
  titulo TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversa_id UUID REFERENCES ai_conversas(id) ON DELETE CASCADE,
  papel TEXT NOT NULL CHECK (papel IN ('user', 'assistant', 'system')),
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. AUTOMAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS automacoes_regras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativa BOOLEAN DEFAULT true,
  gatilho TEXT NOT NULL,
  acoes JSONB NOT NULL DEFAULT '[]',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automacoes_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regra_id UUID REFERENCES automacoes_regras(id),
  status TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'pendente')),
  detalhes JSONB,
  executado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. SYNC QUEUE (WEB ↔ PWA)
-- ============================================

CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operacao TEXT NOT NULL CHECK (operacao IN ('create', 'update', 'delete')),
  tabela TEXT NOT NULL,
  registro_id UUID,
  dados JSONB,
  dispositivo TEXT,
  sincronizado BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_lancamentos_tipo ON lancamentos(tipo);
CREATE INDEX idx_lancamentos_status ON lancamentos(status);
CREATE INDEX idx_lancamentos_vencimento ON lancamentos(vencimento);
CREATE INDEX idx_extratos_conciliado ON extratos_bancarios(conciliado);
CREATE INDEX idx_pix_transacoes_status ON pix_transacoes(status);
CREATE INDEX idx_boletos_status ON boletos(status);
CREATE INDEX idx_boletos_vencimento ON boletos(vencimento);
CREATE INDEX idx_cartoes_status ON cartoes(status);
CREATE INDEX idx_leads_etapa ON leads(etapa);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_projeto ON tarefas(projeto_id);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_sla ON chamados(sla_horas);
CREATE INDEX idx_arquivos_categoria ON arquivos(categoria);
CREATE INDEX idx_sync_queue_sincronizado ON sync_queue(sincronizado);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE extratos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_chaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivo_versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivo_permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE automacoes_regras ENABLE ROW LEVEL SECURITY;
ALTER TABLE automacoes_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for authenticated users, adjust as needed)
CREATE POLICY "Allow all for authenticated" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON lancamentos FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON contas_bancarias FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON extratos_bancarios FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON pix_chaves FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON pix_transacoes FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON boletos FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON cartoes FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON faturas_cartao FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON transacoes_cartao FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON kanban_cards FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON projetos FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON tarefas FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON funcionarios FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON chamados FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON arquivos FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON arquivo_versoes FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON arquivo_permissoes FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON contratos FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ai_conversas FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON ai_mensagens FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON automacoes_regras FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON automacoes_logs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON sync_queue FOR ALL USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON lancamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kanban_cards_updated_at BEFORE UPDATE ON kanban_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projetos_updated_at BEFORE UPDATE ON projetos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON tarefas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chamados_updated_at BEFORE UPDATE ON chamados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync data to sync_queue
CREATE OR REPLACE FUNCTION sync_to_queue()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO sync_queue (operacao, tabela, registro_id, dados, dispositivo)
  VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE TG_OP
      WHEN 'DELETE' THEN NULL
      ELSE to_jsonb(NEW)
    END,
    current_setting('request.headers')::json->>'x-device-id'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply sync triggers to key tables
CREATE TRIGGER sync_lancamentos AFTER INSERT OR UPDATE OR DELETE ON lancamentos FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_extratos AFTER INSERT OR UPDATE OR DELETE ON extratos_bancarios FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_pix AFTER INSERT OR UPDATE OR DELETE ON pix_transacoes FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_boletos AFTER INSERT OR UPDATE OR DELETE ON boletos FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_cartoes AFTER INSERT OR UPDATE OR DELETE ON cartoes FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_tarefas AFTER INSERT OR UPDATE OR DELETE ON tarefas FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
CREATE TRIGGER sync_chamados AFTER INSERT OR UPDATE OR DELETE ON chamados FOR EACH ROW EXECUTE FUNCTION sync_to_queue();
