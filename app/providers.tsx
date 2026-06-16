'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';
import { mantineTheme } from '@/libs/matine/mantine-theme';
import i18n from '@/libs/i18n';
import { LanguageSwitcher } from '@/src/components/utils/LanguageSwitcher';
import { useState } from 'react';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  }));

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={mantineTheme}>
          <Notifications position="top-right" />

          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>

          {children}
        </MantineProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
