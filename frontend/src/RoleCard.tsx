import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${color}`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to={link}
          className={`block w-full text-center py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${color.replace('border-', 'bg-')} hover:opacity-90`}
        >
          Access Portal
        </Link>
      </div>
    </div>
  );
};

export default RoleCard;
