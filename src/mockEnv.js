import { mockTelegramEnv, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { picture } from 'framer-motion/client';

// Mock environment for development or when Telegram context is unavailable
if (import.meta.env.DEV || typeof window.Telegram === 'undefined') {
  let shouldMock = true;

  try {
    // Attempt to retrieve launch parameters
    retrieveLaunchParams();
    // If successful but previously mocked, reapply mock (e.g., after reload)
    shouldMock = !!sessionStorage.getItem('____mocked');
  } catch (e) {
    shouldMock = true; // Mock if retrieval fails (e.g., outside Telegram)
  }

  if (shouldMock) {
    const initDataRaw = new URLSearchParams([
      ['user', JSON.stringify({
        id: 99281932,
        first_name: 'Andrew',
        last_name: 'Rogue',
        username: 'rogue',
        language_code: 'en',
        is_premium: true,
        allows_write_to_pm: true,
        photo_url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Andrew'
      })],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', '1716922846'],
      ['start_param', 'debug'],
      ['chat_type', 'sender'],
      ['chat_instance', '8428209589180549439'],
    ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#17212b',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: '7.2',
      platform: 'tdesktop',
    });
    sessionStorage.setItem('____mocked', '1');
  }
}