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
      className="p-5 border border-[#1f521f] hover:border-[#33ff00] transition-all duration-150 bg-[#0a0a0a]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium tracking-wide uppercase text-[#3f9e5c]">{title}</p>
          <p className="text-2xl font-bold mt-2 text-[#33ff00] term-glow">{value}</p>
          {subtitle && <p className="text-xs mt-1 text-[#3f9e5c]"># {subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              {changeType === 'up' ? (
                <TrendingUp size={14} className="text-[#33ff00]" />
              ) : changeType === 'down' ? (
                <TrendingDown size={14} className="text-[#ff3333]" />
              ) : null}
              <span className={`text-xs font-medium ${
                changeType === 'up' ? 'text-[#33ff00]' : changeType === 'down' ? 'text-[#ff3333]' : 'text-[#3f9e5c]'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 border border-[#1f521f]">
          <Icon size={22} className="text-[#33ff00]" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
