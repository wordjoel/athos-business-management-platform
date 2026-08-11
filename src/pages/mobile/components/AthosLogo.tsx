import React from 'react';

interface AthosLogoProps {
  className?: string;
  size?: number;
}

export default function AthosLogo({ className = 'text-[#39ff14]', size = 48 }: AthosLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      className={`${className} transition-all duration-300`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Left Inner Diagonal Arm */}
      <line 
        x1="26" 
        y1="72" 
        x2="47.5" 
        y2="56.5" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      
      {/* 2. Right Inner Diagonal Arm */}
      <line 
        x1="74" 
        y1="72" 
        x2="52.5" 
        y2="56.5" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />

      {/* 3. Outer Left Leg (slanted parallel bottom cut, tapered top) */}
      <path 
        d="M 47.5,23.5 L 32,59 L 36.5,56 L 50.5,23.5 Z" 
        fill="currentColor" 
      />

      {/* 4. Outer Right Leg (slanted parallel bottom cut, tapered top) */}
      <path 
        d="M 52.5,23.5 L 68,59 L 63.5,56 L 49.5,23.5 Z" 
        fill="currentColor" 
      />

      {/* 5. Central Vertical Stem with the requested arrow/spear pointed tip at the top */}
      <path 
        d="M 50,31 L 55,42 L 52.5,42 L 52.5,80 L 47.5,80 L 47.5,42 L 45,42 Z" 
        fill="currentColor" 
      />

      {/* 6. Rounded Connection Nodes (drawn last on top to mask joints perfectly) */}
      <circle cx="50" cy="20" r="5.5" fill="currentColor" />
      <circle cx="26" cy="72" r="6" fill="currentColor" />
      <circle cx="50" cy="80" r="6" fill="currentColor" />
      <circle cx="74" cy="72" r="6" fill="currentColor" />
    </svg>
  );
}
