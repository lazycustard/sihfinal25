import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { translations, LanguageCode } from './translations';

type I18nContextType = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as LanguageCode | null;
    if (stored && ['en', 'hi', 'or'].includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: LanguageCode) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = useMemo(() => {
    return (key: string) => translations[lang][key] ?? translations['en'][key] ?? key;
  }, [lang]);

  const value = useMemo<I18nContextType>(() => ({ lang, setLang, t }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};



