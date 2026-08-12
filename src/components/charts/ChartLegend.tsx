import React from 'react';
import { CHART_INK_MUTED } from '../../lib/chartTheme';

interface LegendEntry {
  value?: string;
  color?: string;
}

interface ChartLegendProps {
  payload?: LegendEntry[];
}

/** Legenda em chips, consistente com o estilo dos cards — usar via `content={<ChartLegend />}`. */
const ChartLegend: React.FC<ChartLegendProps> = ({ payload }) => {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[11px] font-medium" style={{ color: CHART_INK_MUTED }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
