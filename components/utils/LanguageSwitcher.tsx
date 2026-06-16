'use client';

import { useTranslation } from 'react-i18next';
import { FormSelect } from '@/src/components/form/Select';
import { LANGUAGE_STORAGE_KEY } from '@/src/libs/i18n';

const LANGUAGES = ['pt-br', 'es-mx', 'en-us'] as const;

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  function handleChange(value: string | null) {
    if (!value) return;

    i18n.changeLanguage(value);

    if (typeof window !== 'undefined') localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  }

  return (
    <FormSelect
      aria-label={t('language.label')}
      data={LANGUAGES.map(lng => ({ value: lng, label: t(`language.${lng}`) }))}
      value={i18n.language}
      onChange={handleChange}
      clearable={false}
      size="xs"
      className="w-44"
    />
  );
}
