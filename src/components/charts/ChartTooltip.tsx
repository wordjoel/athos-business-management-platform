import React from 'react';
import { CHART_BORDER, CHART_INK, CHART_INK_MUTED, fmtBRL } from '../../lib/chartTheme';

interface Entry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Entry[];
  currency?: boolean;
}

/** Tooltip glass-card consistente com os cards do dashboard — usar via `content={<ChartTooltip />}`. */
const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, label, payload, currency = true }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className="rounded-xl px-3.5 py-3 min-w-[160px]"
      style={{
        background: '#171B26',
        border: `1px solid ${CHART_BORDER}`,
        boxShadow: '0 16px 40px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,169,97,0.06)',
      }}
    >
      {label !== undefined && (
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: CHART_INK_MUTED }}>
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-[11px]" style={{ color: CHART_INK_MUTED }}>{entry.name}</span>
            </div>
            <span className="text-xs font-semibold tabular-nums" style={{ color: CHART_INK }}>
              {typeof entry.value === 'number' && currency ? fmtBRL(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTooltip;
