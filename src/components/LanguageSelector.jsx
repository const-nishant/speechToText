import React from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        Select Language
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              selectedLanguage === language.code
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
            aria-pressed={selectedLanguage === language.code}
            aria-label={`Select ${language.name} language`}
          >
            <span className="text-xl">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
