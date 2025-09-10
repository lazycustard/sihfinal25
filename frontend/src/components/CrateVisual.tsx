import React from 'react';

interface CrateVisualProps {
  size?: 'sm' | 'md' | 'lg';
  filled?: boolean;
  className?: string;
}

const CrateVisual: React.FC<CrateVisualProps> = ({ 
  size = 'md', 
  filled = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Crate base */}
        <rect x="10" y="40" width="80" height="50" 
              fill="#8b5e3c" stroke="#654321" strokeWidth="2"/>
        
        {/* Wooden slats */}
        <line x1="10" y1="50" x2="90" y2="50" stroke="#654321" strokeWidth="1"/>
        <line x1="10" y1="60" x2="90" y2="60" stroke="#654321" strokeWidth="1"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="#654321" strokeWidth="1"/>
        <line x1="10" y1="80" x2="90" y2="80" stroke="#654321" strokeWidth="1"/>
        
        {/* Vertical supports */}
        <line x1="25" y1="40" x2="25" y2="90" stroke="#654321" strokeWidth="1"/>
        <line x1="50" y1="40" x2="50" y2="90" stroke="#654321" strokeWidth="1"/>
        <line x1="75" y1="40" x2="75" y2="90" stroke="#654321" strokeWidth="1"/>
        
        {/* Contents if filled */}
        {filled && (
          <g>
            {/* Vegetables/produce */}
            <circle cx="30" cy="30" r="8" fill="#22c55e" opacity="0.8"/>
            <circle cx="50" cy="25" r="6" fill="#ef4444" opacity="0.8"/>
            <circle cx="70" cy="32" r="7" fill="#f59e0b" opacity="0.8"/>
            <circle cx="40" cy="35" r="5" fill="#8b5cf6" opacity="0.8"/>
            <circle cx="60" cy="28" r="6" fill="#22c55e" opacity="0.8"/>
          </g>
        )}
        
        {/* Wood grain texture */}
        <defs>
          <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#8b5e3c"/>
            <path d="M0,2 Q2,1 4,2" stroke="#654321" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect x="10" y="40" width="80" height="50" fill="url(#woodGrain)" opacity="0.3"/>
      </svg>
    </div>
  );
};

export default CrateVisual;
