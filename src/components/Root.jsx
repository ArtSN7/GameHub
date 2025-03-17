import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useEffect, useMemo } from 'react';

import App from '@/components/App.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';

function ErrorBoundaryError({ error }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Inner() {
  const lp = useLaunchParams();
  if (!lp) {
    console.warn('No launch parameters, rendering fallback');
    return <div>Waiting for launch parameters...</div>;
  }

  const debug = lp.startParam === 'debug';
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  useEffect(() => {
    console.log('Inner render - Launch Params:', lp);
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <SDKProvider acceptCustomStyles debug={debug}>
        <App />
      </SDKProvider>
    </TonConnectUIProvider>
  );
}
export function Root() {
  useEffect(() => {
    console.log('Root mounted');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log('WebApp.ready() called');
    }
  }, []);

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Inner />
    </ErrorBoundary>
  );
}