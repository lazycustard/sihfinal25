import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
import { useTheme } from './contexts/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showWhyInfo, setShowWhyInfo] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-body ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'textured-bg farm-bg text-dark-brown'
    }`}>
      {/* Government Header Banner */}
      <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900' : 'rustic-header'} text-white py-2 px-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-800 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                🇮🇳 Government of India
              </a>
            </div>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Ministry of Agriculture & Farmers Welfare</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">📞 Helpline: 1800-180-1551</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">📧 support@farmtofork.gov.in</span>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'rustic-card border-warm-brown'} shadow-lg border-b-2 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl swaying-leaf hand-drawn-icon">🌱</span>
                    <span className={`text-xl font-bold font-heading ${theme === 'dark' ? 'text-white' : 'text-deep-green'}`}>{t('app_name')}</span>
                  </div>
                  <span className={`text-xs font-body ${theme === 'dark' ? 'text-gray-300' : 'text-warm-brown'}`}>Blockchain Traceability System</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('welcome')}, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-green-800 text-green-200' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user?.role}
                  </span>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="text-sm text-gray-700 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    aria-label="Language selector"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="or">ଓଡ଼ିଆ</option>
                  </select>
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all rustic-btn-accent hand-drawn-icon ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                        : 'text-dark-brown'
                    }`}
                  >
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </button>
                  <button
                    onClick={logout}
                    className={`text-sm px-3 py-2 rounded-md transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-white bg-red-900 hover:bg-red-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav_logout')}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="text-sm text-gray-700 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    aria-label="Language selector"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="or">ଓଡ଼ିଆ</option>
                  </select>
                  <button
                    onClick={toggleTheme}
                    className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </button>
                  <Link
                    to="/login"
                    className={`text-sm px-3 py-2 rounded-md transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-white bg-blue-900 hover:bg-blue-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav_login')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

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

      {/* Government of Odisha Style Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} mt-auto transition-colors duration-300`}>
        {/* Quick Links Section */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} py-8`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Important Links */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Important Links</h3>
                <ul className="space-y-2">
                  <li><a href="https://odisha.gov.in/tenders" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>All Tenders/Quotations</a></li>
                  <li><a href="https://odisha.gov.in/advertisements" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>All Advertisements</a></li>
                  <li><a href="https://tender.odisha.gov.in/" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>e-Procurement</a></li>
                  <li><a href="https://etenders.gov.in/eprocure/app" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Tender.gov.in</a></li>
                </ul>
              </div>
              
              {/* Services */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Services</h3>
                <ul className="space-y-2">
                  <li><a href="/farmer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Farmer Registration</a></li>
                  <li><a href="/consumer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Product Traceability</a></li>
                  <li><a href="/supply" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Supply Chain Management</a></li>
                  <li><a href="/consumer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Consumer Verification</a></li>
                </ul>
              </div>
              
              {/* Policies */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Policies</h3>
                <ul className="space-y-2">
                  <li><a href="https://odisha.gov.in/sites/default/files/2021-05/Agriculture_Policy_2020.pdf" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Agriculture Policy</a></li>
                  <li><a href="https://odisha.gov.in/sites/default/files/2022-03/IT_Policy_2022.pdf" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>IT Policy-2022</a></li>
                  <li><a href="https://odisha.gov.in/sites/default/files/2021-08/Electronics_Policy_2021.pdf" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Electronics Policy-2021</a></li>
                  <li><a href="https://odisha.gov.in/sites/default/files/2022-06/Data_Centre_Policy_2022.pdf" target="_blank" rel="noopener noreferrer" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Data Centre Policy-2022</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
                <ul className="space-y-2">
                  <li><a href="/contact" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact Us</a></li>
                  <li><a href="/feedback" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Feedback / Grievance</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Government Logo and Text */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://odisha.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                  aria-label="Government of Odisha official website"
                >
                  <img
                    src="/odisha.png"
                    alt="Government of Odisha logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                  />
                </a>
                <div className="relative">
                  <a 
                    href="https://odisha.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} transition-colors`} 
                    style={{ fontFamily: 'Merriweather, serif' }}
                  >
                    Government of Odisha
                  </a>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Ministry of Agriculture & Farmers Welfare
                  </p>
                  {/* Animated Wheat Field */}
                  <div className="absolute -right-8 top-0 opacity-30">
                    <svg width="60" height="40" viewBox="0 0 60 40" className="wheat-animation">
                      <g>
                        <path d="M10 35 L10 25 L8 20 L10 15 L12 20 L10 25" fill="#f59e0b" opacity="0.7"/>
                        <line x1="10" y1="25" x2="10" y2="35" stroke="#65a30d" strokeWidth="1.5"/>
                        <path d="M20 35 L20 22 L18 18 L20 12 L22 18 L20 22" fill="#f59e0b" opacity="0.7"/>
                        <line x1="20" y1="22" x2="20" y2="35" stroke="#65a30d" strokeWidth="1.5"/>
                        <path d="M30 35 L30 28 L28 23 L30 18 L32 23 L30 28" fill="#f59e0b" opacity="0.7"/>
                        <line x1="30" y1="28" x2="30" y2="35" stroke="#65a30d" strokeWidth="1.5"/>
                        <path d="M40 35 L40 24 L38 19 L40 14 L42 19 L40 24" fill="#f59e0b" opacity="0.7"/>
                        <line x1="40" y1="24" x2="40" y2="35" stroke="#65a30d" strokeWidth="1.5"/>
                        <path d="M50 35 L50 26 L48 21 L50 16 L52 21 L50 26" fill="#f59e0b" opacity="0.7"/>
                        <line x1="50" y1="26" x2="50" y2="35" stroke="#65a30d" strokeWidth="1.5"/>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Quick Navigation */}
              <div className="flex items-center space-x-6">
                <a href="/" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Home</a>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
                <a href="/contact" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact Us</a>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
                <a href="/feedback" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Feedback</a>
                <button
                  onClick={() => setShowWhyInfo(true)}
                  className={`text-sm ${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-900'} underline transition-colors`}
                >
                  Why Choose FarmToFork
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright and Disclaimer */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t py-6`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-2">
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  For best experience view the site in 1920x1080 resolution. Support all modern browsers Chrome v84+, Safari 4+, Mozilla Firefox v90+
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Government of Odisha © 2024. All rights Reserved.</strong> Powered by OCAC
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Credits: Created by <strong>Bani Gupta</strong>
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  <strong>Disclaimer:</strong> This is the official web portal of Government of Odisha. Information Technology Department is the nodal department, respective departments are responsible for their information
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  The content of this website is licensed under{' '}
                  <a 
                    href="http://creativecommons.org/licenses/by/4.0/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline transition-colors`}
                  >
                    Creative Commons Attribution 4.0 International License
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
