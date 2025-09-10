import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ParchmentCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  stamp?: boolean;
  style?: React.CSSProperties;
}

const ParchmentCard: React.FC<ParchmentCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  stamp = false,
  style 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`
        relative bg-paper-texture rounded-lg p-6 
        border border-amber-200/50 shadow-lg
        ${hover ? 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300' : ''}
        ${stamp ? 'stamp' : ''}
        ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}
        earthy-shadow-lg
        ${className}
      `}
      style={style}
    >
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 bg-grain-overlay rounded-lg opacity-30"></div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-400/40 rounded-tl-lg"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-400/40 rounded-tr-lg"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-400/40 rounded-bl-lg"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-400/40 rounded-br-lg"></div>
      
      {/* Aged paper effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-50/10 via-transparent to-amber-100/20 pointer-events-none"></div>
    </div>
  );
};

export default ParchmentCard;
