import React, { useState } from 'react';
import { translations, LanguageCode } from '../i18n/translations';

interface MultilingualProductProps {
  productKey: string;
  className?: string;
  showAllLanguages?: boolean;
  language?: LanguageCode;
}

const MultilingualProduct: React.FC<MultilingualProductProps> = ({ 
  productKey, 
  className = '', 
  showAllLanguages = false,
  language = 'en'
}) => {
  const [currentLang] = useState<LanguageCode>(language);
  
  // Get the product name in current language
  const currentName = translations[language as LanguageCode][`product_${productKey}`] || productKey;
  
  if (showAllLanguages) {
    return (
      <div className={`multilingual-product ${className}`}>
        <div className="primary-name text-lg font-semibold">
          {currentName}
        </div>
        <div className="alternate-names text-sm text-gray-600 dark:text-gray-400 mt-1 space-x-2">
          {currentLang !== 'en' && (
            <span className="inline-block">EN: {translations.en[`product_${productKey}`] || productKey}</span>
          )}
          {currentLang !== 'hi' && (
            <span className="inline-block">हि: {translations.hi[`product_${productKey}`] || productKey}</span>
          )}
          {currentLang !== 'or' && (
            <span className="inline-block">ଓଡ଼: {translations.or[`product_${productKey}`] || productKey}</span>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <span className={`multilingual-product-simple ${className}`}>
      {currentName}
    </span>
  );
};

export default MultilingualProduct;
