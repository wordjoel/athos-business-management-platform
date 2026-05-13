import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
  darkMode: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon: Icon, color, darkMode, subtitle }) => {
  const colorMap: Record<string, { bg: string; bgDark: string; icon: string; text: string }> = {
    purple: { bg: 'bg-athos-50', bgDark: 'bg-athos-500/10', icon: 'text-athos-500', text: 'text-athos-400' },
    green: { bg: 'bg-emerald-50', bgDark: 'bg-emerald-500/10', icon: 'text-emerald-500', text: 'text-emerald-400' },
    blue: { bg: 'bg-blue-50', bgDark: 'bg-blue-500/10', icon: 'text-blue-500', text: 'text-blue-400' },
    amber: { bg: 'bg-amber-50', bgDark: 'bg-amber-500/10', icon: 'text-amber-500', text: 'text-amber-400' },
    red: { bg: 'bg-red-50', bgDark: 'bg-red-500/10', icon: 'text-red-500', text: 'text-red-400' },
    pink: { bg: 'bg-pink-50', bgDark: 'bg-pink-500/10', icon: 'text-pink-500', text: 'text-pink-400' },
    cyan: { bg: 'bg-cyan-50', bgDark: 'bg-cyan-500/10', icon: 'text-cyan-500', text: 'text-cyan-400' },
  };

  const colors = colorMap[color] || colorMap.purple;

  return (
    <div className={`rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
      darkMode
        ? 'bg-gray-900/80 border border-white/5 hover:border-white/10'
        : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium tracking-wide uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              {changeType === 'up' ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : changeType === 'down' ? (
                <TrendingDown size={14} className="text-red-400" />
              ) : null}
              <span className={`text-xs font-medium ${
                changeType === 'up' ? 'text-emerald-400' : changeType === 'down' ? 'text-red-400' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${darkMode ? colors.bgDark : colors.bg}`}>
          <Icon size={22} className={darkMode ? colors.text : colors.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
