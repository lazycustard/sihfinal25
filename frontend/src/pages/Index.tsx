import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleCard from '../RoleCard';
import ParchmentCard from '../components/ParchmentCard';
import CrateVisual from '../components/CrateVisual';
import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

const Index: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [showWhyInfo, setShowWhyInfo] = useState(false);
  const roles = [
    {
      title: t('role_farmer'),
      description: t('role_farmer_desc'),
      icon: '🌾',
      link: '/farmer-auth',
      color: 'border-emerald-500',
      features: [
        t('feature_register_products'),
        t('feature_generate_qr'),
        t('feature_track_batches'),
        t('feature_manage_inventory')
      ]
    },
    {
      title: t('role_supply_partner'),
      description: t('role_supply_partner_desc'),
      icon: '🚚',
      link: '/supply-auth',
      color: 'border-orange-500',
      features: [
        t('feature_receive_from_farmers'),
        t('feature_update_locations'),
        t('feature_transfer_ownership'),
        t('feature_manage_network'),
        t('feature_update_inventory'),
        t('feature_track_sales')
      ]
    },
    
    {
      title: t('role_consumer'),
      description: t('role_consumer_desc'),
      icon: '👥',
      link: '/consumer',
      color: 'border-violet-600',
      features: [
        t('feature_scan_qr'),
        t('feature_verify_authenticity'),
        t('feature_view_journey'),
        t('feature_report_issues')
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-paper-texture">
      {/* Background Layer - Subtle textures */}
      <div className="absolute inset-0 bg-grain-overlay">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJ3aGVhdCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj4KICAgICAgPHBhdGggZD0iTTIwIDVMMjUgMTVMMjAgMjVMMTUgMTVaIiBmaWxsPSIjZjU5ZTBiIiBvcGFjaXR5PSIwLjMiLz4KICAgICAgPGxpbmUgeDE9IjIwIiB5MT0iMjUiIHgyPSIyMCIgeTI9IjM1IiBzdHJva2U9IiM2NTdkMzEiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2hlYXQpIi8+Cjwvc3ZnPg==')]"></div>
        </div>
      </div>

      {/* Hero Section with Get Started and Scan Code */}
      <div className="content-layer max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 mb-8">
          <h2 className="text-4xl md:text-5xl heading-font font-bold text-rustic-brown-800 dark:text-white mb-6">
            {t('hero_title')}
          </h2>
          <p className="text-xl text-rustic-brown-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          
          {/* Search and Action Buttons */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-rustic-brown-800 dark:text-white mb-4">
              {t('hero_trace_food')}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder={t('hero_placeholder')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <Link
                  to="/consumer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('hero_trace_btn')}
                </Link>
                <Link
                  to="/consumer"
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📱 {t('hero_scan_qr_btn')}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Role Selection - Content Layer */}
      <div id="roles" className="content-layer max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <ParchmentCard className="inline-block" stamp={true}>
            <h2 className="text-3xl heading-font mb-4">
              {t('home_choose_role')}
            </h2>
            <p className="text-lg body-font" style={{color: 'var(--color-trust-green)'}}>
              {t('home_choose_role_sub')}
            </p>
          </ParchmentCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 interaction-layer">
          {roles.map((role, index) => (
            <div key={index} className="scroll-reveal" style={{animationDelay: `${index * 0.2}s`}}>
              <RoleCard {...role} />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section - Content Layer */}
      <div className="content-layer py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ParchmentCard className="inline-block">
              <button
                onClick={() => setShowWhyInfo(true)}
                className="text-left w-full hover:opacity-80 transition-opacity cursor-pointer"
              >
                <h2 className="text-3xl heading-font mb-4">
                  {t('home_why_choose')}
                </h2>
                <p className="text-lg body-font" style={{color: 'var(--color-trust-green)'}}>
                  {t('home_secure_immutable_desc')}
                </p>
              </button>
            </ParchmentCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 interaction-layer">
            <ParchmentCard className="text-center hover-lift scroll-reveal">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--color-growth-green)', color: 'white'}}>
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl heading-font mb-2">{t('home_secure_immutable')}</h3>
              <p className="body-font" style={{color: 'var(--color-trust-green)'}}>
                {t('home_secure_immutable_desc')}
              </p>
            </ParchmentCard>

            <ParchmentCard className="text-center hover-lift scroll-reveal" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--color-nav-brown)', color: 'white'}}>
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl heading-font mb-2">{t('home_qr_integration')}</h3>
              <p className="body-font" style={{color: 'var(--color-trust-green)'}}>
                {t('home_qr_integration_desc')}
              </p>
            </ParchmentCard>

            <ParchmentCard className="text-center hover-lift scroll-reveal" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--color-earth-yellow)', color: 'var(--color-trust-green)'}}>
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl heading-font mb-2">{t('home_realtime_tracking')}</h3>
              <p className="body-font" style={{color: 'var(--color-trust-green)'}}>
                {t('home_realtime_tracking_desc')}
              </p>
            </ParchmentCard>
          </div>
        </div>
      </div>

      {/* Why Choose FarmToFork Modal */}
      {showWhyInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]">
          <div className={`parchment-card max-w-2xl w-full p-6 relative ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
            <button
              onClick={() => setShowWhyInfo(false)}
              className={`absolute top-4 right-4 text-2xl ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-rustic-brown hover:text-rustic-brown'} transition-colors`}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className={`text-2xl font-heading mb-6 ${theme === 'dark' ? 'text-white' : 'text-rustic-brown'}`}>🌾 Why Choose FarmToFork</h2>
            <div className="space-y-6 font-body">
              <div>
                <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-rustic-brown'}`}>
                  🎯 Project Purpose
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>
                  A blockchain-enabled Farm-to-Fork supply chain support platform that brings full traceability and trust to agricultural produce.
                </p>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-rustic-brown'}`}>
                  🔧 Uses
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Connects farmers directly with consumers and retailers</li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Reduces middlemen to ensure fair pricing</li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Authenticates product origin and certifications</li>
                </ul>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-rustic-brown'}`}>
                  📈 Impact
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Improves transparency across the value chain</li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Boosts farmer income and market access</li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-rustic-brown'} opacity-90`}>Ensures fresh, safely handled produce delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
