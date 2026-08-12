-- ============================================
-- ATHOS BUSINESS MANAGEMENT PLATFORM
-- Financeiro fixes: boletos, cartões (redesenho por sócio), despesas_cartao
-- ============================================

-- ============================================
-- 1. BOLETOS: endereço do sacado (campo novo do formulário)
-- ============================================

ALTER TABLE boletos ADD COLUMN IF NOT EXISTS sacado_endereco TEXT;

-- ============================================
-- 1b. EXTRATOS_BANCARIOS: a tela de Conciliação Bancária lança o banco/agência/
-- conta como texto livre de cada linha do extrato (não pelo conta_id da tabela
-- contas_bancarias) — a UI atual não pede pro usuário selecionar uma conta
-- cadastrada, então precisamos guardar esses campos direto na linha do extrato.
-- ============================================

ALTER TABLE extratos_bancarios ADD COLUMN IF NOT EXISTS banco TEXT;
ALTER TABLE extratos_bancarios ADD COLUMN IF NOT EXISTS agencia TEXT;
ALTER TABLE extratos_bancarios ADD COLUMN IF NOT EXISTS conta TEXT;

-- ============================================
-- 2. CARTÕES: redesenho de "cartão da empresa" pra "cartão por sócio"
-- ============================================

ALTER TABLE cartoes DROP COLUMN IF EXISTS nome;
ALTER TABLE cartoes DROP COLUMN IF EXISTS limite;
ALTER TABLE cartoes DROP COLUMN IF EXISTS fatura_atual;
ALTER TABLE cartoes DROP COLUMN IF EXISTS dia_fechamento;
ALTER TABLE cartoes DROP COLUMN IF EXISTS dia_vencimento;

ALTER TABLE cartoes ADD COLUMN IF NOT EXISTS socio_nome TEXT NOT NULL DEFAULT '';
ALTER TABLE cartoes ADD COLUMN IF NOT EXISTS socio_email TEXT;
ALTER TABLE cartoes ADD COLUMN IF NOT EXISTS limite_total DECIMAL(12,2) NOT NULL DEFAULT 0;
ALTER TABLE cartoes ADD COLUMN IF NOT EXISTS limite_usado DECIMAL(12,2) NOT NULL DEFAULT 0;

ALTER TABLE cartoes ALTER COLUMN socio_nome DROP DEFAULT;
ALTER TABLE cartoes ALTER COLUMN limite_total DROP DEFAULT;

-- ============================================
-- 3. DESPESAS_CARTAO: substitui o par faturas_cartao/transacoes_cartao
-- (essas duas tabelas antigas ficam como estão, sem uso, não são apagadas)
-- ============================================

CREATE TABLE IF NOT EXISTS despesas_cartao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cartao_id UUID REFERENCES cartoes(id),
  socio_nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  data TEXT NOT NULL,
  parcela_atual INTEGER,
  total_parcelas INTEGER,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'atrasada')),
  usuario_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE despesas_cartao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON despesas_cartao FOR ALL USING (true);

-- ============================================
-- 4. GRANTS explícitos (não é a causa confirmada do PGRST205, mas é seguro
-- garantir isso de qualquer forma pra todo o schema public)
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
