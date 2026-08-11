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
  <motion.div variants={itemVariants} initial="hidden" animate="visible" className={`border border-[#1f521f] bg-[#0a0a0a] ${className || ''}`}>
    <div className="px-5 py-3 border-b border-[#1f521f] flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- {title} ---+</h3>
      </div>
      {right}
    </div>
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </motion.div>
);

export default TerminalPane;
