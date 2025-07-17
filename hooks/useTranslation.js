import { useRouter } from 'next/router';
import { useCallback } from 'react';
import fr from '../locales/fr/common.json';
import en from '../locales/en/common.json';

const translations = { fr, en };

export default function useTranslation() {
  const { locale } = useRouter();
  const t = useCallback(
    (key) => translations[locale]?.[key] || key,
    [locale]
  );
  return { t, locale };
}
