import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from './i18n/I18nContext';

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  features: string[];
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  link,
  color,
  features
}) => {
  const { t } = useI18n();
  return (
    <div className={`backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-l-4 ${color}`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border shadow-lg ${color.replace('border-', 'bg-').replace('-500', '-100').replace('-600', '-100')} ${color.replace('border-', 'border-').replace('-500', '-300').replace('-600', '-400')}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-700 text-sm">{description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">{t('key_features')}</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${color.replace('border-', 'bg-').replace('-500', '-500').replace('-600', '-600')}`}></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to={link}
          className={`block w-full text-center py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${color.replace('border-', 'bg-').replace('-500', '-600').replace('-600', '-700')} ${color.replace('border-', 'border-').replace('-500', '-500').replace('-600', '-600')} hover:scale-105`}
        >
          {t('access_portal')}
        </Link>
      </div>
    </div>
  );
};

export default RoleCard;
