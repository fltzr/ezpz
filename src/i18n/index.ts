import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationsEN from './locales/en.json';
import translationsFR from './locales/fr.json';

const resources = {
  en: {
    translation: translationsEN,
  },
  fr: {
    translation: translationsFR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    react: {
      useSuspense: true,
    },
  })
  .catch(console.error);

export default i18n;
