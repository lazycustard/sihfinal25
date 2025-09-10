import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface WoodNavigationProps {
  items: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
}

const WoodNavigation: React.FC<WoodNavigationProps> = ({ items }) => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const location = useLocation();

  return (
    <nav className={`bg-wood-grain relative overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : ''
    }`}>
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 bg-grain-overlay opacity-60"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {items.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                    transform hover:-translate-y-1 hover:shadow-lg
                    ${isActive 
                      ? 'bg-yellow-400/20 text-yellow-900 shadow-md border border-yellow-500/30' 
                      : 'text-cream hover:bg-yellow-400/10 hover:text-yellow-100'
                    }
                    earthy-shadow
                  `}
                >
                  {item.icon && (
                    <span className="mr-2 text-lg">{item.icon}</span>
                  )}
                  {item.label}
                  
                  {/* Wooden plank effect */}
                  <div className={`
                    absolute inset-0 rounded-lg border-2 border-amber-800/30
                    ${isActive ? 'bg-gradient-to-b from-yellow-200/10 to-amber-300/10' : ''}
                  `}></div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WoodNavigation;
