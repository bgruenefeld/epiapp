import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Ermöglicht das Laden von Übersetzungsdateien
  .use(LanguageDetector) // Erkennt die Sprache des Nutzers (z.B. aus den Browsereinstellungen)
  .use(initReactI18next) // Verknüpft i18next mit React
  .init({
    fallbackLng: 'en', // Standard-Sprache
    partialBundledLanguages: true,
    debug: true, // In der Entwicklung aktivieren, in Produktion deaktivieren
    interpolation: {
      escapeValue: false, // Erlaubt HTML in Übersetzungen
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Pfad zu den JSON-Übersetzungen
    },
  });

export default i18n;
