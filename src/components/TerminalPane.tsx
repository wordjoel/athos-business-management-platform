import React from 'react';
import { motion } from 'framer-motion';

interface TerminalPaneProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  noPadding?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TerminalPane: React.FC<TerminalPaneProps> = ({ title, icon, className, children, right, noPadding }) => (
  <motion.div variants={itemVariants} initial="hidden" animate="visible" className={`glass-card ${className || ''}`}>
    <div className="px-5 py-4 border-b border-[#232837] flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-[#C9A961]">{icon}</span>}
        <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-[#8B93A6]">{title}</h3>
      </div>
      {right}
    </div>
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </motion.div>
);

export default TerminalPane;
