import React from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳" },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 className="language-title">Select Language</h3>

      <div className="language-buttons">
        {languages.map((language) => {
          const isSelected = selectedLanguage === language.code;

          return (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "2px solid",
                borderColor: isSelected ? "#3B82F6" : "#E5E7EB",
                backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                color: isSelected ? "#1D4ED8" : "#374151",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${language.name} language`}
            >
              <span style={{ fontSize: "1.25rem" }}>{language.flag}</span>
              <span style={{ fontWeight: 500 }}>{language.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
