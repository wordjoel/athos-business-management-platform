import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
  darkMode: boolean;
  subtitle?: string;
  index?: number;
  /** Série curta (ex: últimos 6 meses) para o sparkline de tendência — opcional. */
  trend?: number[];
}

const TREND_COLOR: Record<'up' | 'down' | 'neutral', string> = {
  up: '#2F9E7C',
  down: '#A6484A',
  neutral: '#5B7FA8',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon: Icon, subtitle, index = 0, trend }) => {
  const sparkColor = TREND_COLOR[changeType];
  const sparkData = trend && trend.length > 1 ? trend.map((v, i) => ({ i, v })) : null;
  const gradId = `stat-spark-${index}-${title.replace(/\s+/g, '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className="group relative p-5 rounded-2xl border border-[#232837] bg-[#131722] hover:border-[#C9A961]/40 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_28px_-16px_rgba(0,0,0,0.55)] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(140px circle at 85% -10%, rgba(201,169,97,0.10), transparent 70%)' }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium tracking-wide uppercase text-[#8B93A6]">{title}</p>
          <p className="font-display text-2xl mt-2 text-[#F0E6CC] tabular-nums">{value}</p>
          {subtitle && <p className="text-xs mt-1 text-[#8B93A6]">{subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              {changeType === 'up' ? (
                <TrendingUp size={14} className="text-[#2F9E7C]" />
              ) : changeType === 'down' ? (
                <TrendingDown size={14} className="text-[#A6484A]" />
              ) : null}
              <span className={`text-xs font-medium ${
                changeType === 'up' ? 'text-[#2F9E7C]' : changeType === 'down' ? 'text-[#A6484A]' : 'text-[#8B93A6]'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[#1E2430] flex-shrink-0">
          <Icon size={22} className="text-[#C9A961]" />
        </div>
      </div>
      {sparkData && (
        <div className="relative h-9 -mx-1 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={1.5} fill={`url(#${gradId})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
