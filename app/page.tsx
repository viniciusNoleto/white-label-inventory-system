'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 max-w-2xl text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            StockFlow
          </h1>

          <p className="text-lg text-gray-500">
            {t('home.subtitle')}
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed">
          {t('home.description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/inventory"
            className="px-8 py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-sm"
          >
            {t('home.ctaPrimary')}
          </Link>

          <a
            href="#features"
            className="px-8 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            {t('home.ctaSecondary')}
          </a>
        </div>

        <div
          id="features"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4"
        >
          <div className="flex flex-col gap-2 p-5 bg-white rounded-xl border border-gray-100 shadow-sm text-left">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-500"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </div>

            <span className="font-semibold text-gray-800">
              {t('home.features.categories.title')}
            </span>

            <span className="text-sm text-gray-500">
              {t('home.features.categories.description')}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-5 bg-white rounded-xl border border-gray-100 shadow-sm text-left">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-500"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>

            <span className="font-semibold text-gray-800">
              {t('home.features.stock.title')}
            </span>

            <span className="text-sm text-gray-500">
              {t('home.features.stock.description')}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-5 bg-white rounded-xl border border-gray-100 shadow-sm text-left">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-500"
              >
                <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              </svg>
            </div>

            <span className="font-semibold text-gray-800">
              {t('home.features.build.title')}
            </span>

            <span className="text-sm text-gray-500">
              {t('home.features.build.description')}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
