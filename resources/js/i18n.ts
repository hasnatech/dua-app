import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'nl'],
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie', 'localStorage'],
    },
    backend: {
      // Instead of local files, fetch from Laravel
      loadPath: '/translations/{{lng}}',
      parse: (data: string) => {
        const json = JSON.parse(data);
        // console.log('Loaded translations:', json);  
        return json.messages; // Laravel response: { locale: "en", messages: {...} }
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
