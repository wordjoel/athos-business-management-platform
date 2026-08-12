/**
 * Tema compartilhado dos gráficos ATHOS Private.
 *
 * A paleta categórica abaixo passa nos 6 checks de acessibilidade cromática
 * (banda de luminosidade, piso de croma, separação CVD, piso de visão normal,
 * contraste e ordem fixa) contra o surface escuro dos cards (#131722) — ver
 * skill "dataviz". Nunca embaralhar a ordem dos slots; cada posição foi
 * escolhida para maximizar a distância perceptual com a vizinha.
 */

export const CATEGORICAL: { name: string; hex: string }[] = [
  { name: 'safira', hex: '#3987E5' },
  { name: 'cobre', hex: '#D95926' },
  { name: 'esmeralda', hex: '#199E70' },
  { name: 'âmbar', hex: '#C98500' },
  { name: 'rubi', hex: '#D55181' },
  { name: 'jade', hex: '#1F9E4A' },
  { name: 'ametista', hex: '#9085E9' },
  { name: 'vinho', hex: '#E66767' },
];

export const CATEGORY_COLORS = CATEGORICAL.map(c => c.hex);

/** Duas séries (receita/despesa) — herda a identidade da marca, alto contraste. */
export const SEMANTIC = {
  positivo: '#C9A961', // champagne gold — receita, saldo, orçamento
  negativo: '#A6484A', // wine — despesa, estouro
  positivoSoft: 'rgba(201,169,97,0.25)',
  negativoSoft: 'rgba(166,72,74,0.25)',
  neutro: '#5B7FA8', // sapphire — pendências, info
};

export const CHART_SURFACE = '#131722';
export const CHART_BORDER = '#232837';
export const CHART_INK = '#E9E4D8';
export const CHART_INK_MUTED = '#8B93A6';
export const CHART_GRID = 'rgba(201,169,97,0.08)';

export const AXIS_TICK = { fill: CHART_INK_MUTED, fontSize: 11, fontFamily: 'Inter, sans-serif' };
export const TOOLTIP_STYLE = {
  background: '#171B26',
  border: `1px solid ${CHART_BORDER}`,
  borderRadius: 12,
  fontSize: 12,
  color: CHART_INK,
  boxShadow: '0 16px 40px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,169,97,0.06)',
  padding: '10px 14px',
};

export const fmtBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export const fmtCompact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${v}`;

export const tooltipFmt = (value: unknown) => (typeof value === 'number' ? fmtBRL(value) : String(value));

export interface PieDatum {
  name: string;
  value: number;
  cor: string;
  pct: number;
}

/** Agrupa itens de cauda longa numa fatia "Outras" — mantém no máx. `n` fatias nomeadas por gráfico. */
export function topNWithOthers(items: PieDatum[], n = 7): PieDatum[] {
  if (items.length <= n) return items;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, n);
  const rest = sorted.slice(n);
  const outrasValue = rest.reduce((s, i) => s + i.value, 0);
  const outrasPct = rest.reduce((s, i) => s + i.pct, 0);
  return [...head, { name: 'Outras', value: outrasValue, pct: outrasPct, cor: CHART_INK_MUTED }];
}
