import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

function SupplyAuth() {
  const { t } = useI18n();
  const [license, setLicense] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!license || !name) return;
    navigate('/supply', { state: { license, name } });
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('supply_auth_title') || 'Supply Partner Authentication'}</h1>
        <p className="text-sm text-gray-600 mb-6">{t('supply_auth_sub') || 'Login or Register to continue'}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('license_number')}</label>
            <input
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder={t('placeholder_license') || 'Enter License Number'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('placeholder_name') || 'Enter Name'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('continue') || 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupplyAuth;




