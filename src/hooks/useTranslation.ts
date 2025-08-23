import { useLanguageStore } from "../store/languageStore";
import { translations, TranslationKey } from "../translations";

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();

  const t = (key: TranslationKey): string => {
    const languageTranslations =
      translations[currentLanguage.code as keyof typeof translations];
    if (!languageTranslations) {
      // Fallback to English if translation not found
      return translations.EN[key] || key;
    }
    return languageTranslations[key] || translations.EN[key] || key;
  };

  return { t, currentLanguage };
};
