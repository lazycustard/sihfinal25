import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-green-50 to-blue-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">FarmToFork Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Address:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ministry of Agriculture & Farmers Welfare<br/>
                    Government of Odisha<br/>
                    Krishi Bhawan, Bhubaneswar<br/>
                    Odisha - 751001
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Phone:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    +91-674-2393-XXX
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Email:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    support@farmtofork.odisha.gov.in
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Technical Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">IT Helpdesk:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    +91-674-2301-XXX
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Email:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    tech@farmtofork.odisha.gov.in
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Working Hours:</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Monday - Friday: 9:00 AM - 6:00 PM<br/>
                    Saturday: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/farmer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                Farmer Portal
              </a>
              <a href="/supply" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                Supply Chain
              </a>
              <a href="/consumer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                Consumer Portal
              </a>
              <a href="/help" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
