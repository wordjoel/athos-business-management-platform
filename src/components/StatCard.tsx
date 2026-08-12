import React from 'react';
import { motion } from 'framer-motion';
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
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon: Icon, subtitle, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="p-5 rounded-2xl border border-[#232837] bg-[#131722] hover:border-[#C9A961]/40 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_28px_-16px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium tracking-wide uppercase text-[#8B93A6]">{title}</p>
          <p className="font-display text-2xl mt-2 text-[#F0E6CC]">{value}</p>
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
        <div className="p-3 rounded-xl bg-[#1E2430]">
          <Icon size={22} className="text-[#C9A961]" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
