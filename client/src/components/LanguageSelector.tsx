import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  // Funktion zum Wechseln der Sprache
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage); // Speichert die Sprache
  };

  return (
    <div className="dropdown me-2">
      <select
        className="form-select form-select-sm"
        onChange={changeLanguage}
        value={i18n.language} // Aktuelle Sprache setzen
        aria-label="Language select"
      >
        <option value="">{i18n.t('language')}</option> {/* Falls keine Sprache gesetzt ist */}
        <option value="de">🇩🇪 Deutsch</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
