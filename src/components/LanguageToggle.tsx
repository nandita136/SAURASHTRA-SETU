import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { getLanguage, setLanguage, Language } from '../utils/language';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  const toggleLanguage = () => {
    const newLang: Language = currentLang === 'en' ? 'gu' : 'en';
    setLanguage(newLang);
    setCurrentLang(newLang);
    window.location.reload(); // Reload to apply translations
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      title="Change Language"
    >
      <Languages className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {currentLang === 'en' ? 'ગુજરાતી' : 'English'}
      </span>
    </button>
  );
}
