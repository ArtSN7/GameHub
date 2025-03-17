import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { routes } from '@/navigation/routes.jsx';

export function App() {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    // Ensure Telegram WebApp is ready
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log('WebApp.ready() called');
    } else {
      console.warn('Telegram WebApp not available');
    }
  }, []);

  useEffect(() => {
    if (miniApp && themeParams) {
      return bindMiniAppCSSVars(miniApp, themeParams);
    }
  }, [miniApp, themeParams]);

  useEffect(() => {
    if (themeParams) {
      return bindThemeParamsCSSVars(themeParams);
    }
  }, [themeParams]);

  useEffect(() => {
    if (viewport) {
      viewport.expand();
      return bindViewportCSSVars(viewport);
    }
  }, [viewport]);

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  useEffect(() => {
    console.log('Launch Params:', lp);
    if (!lp) {
      console.warn('No launch parameters available');
    }
  }, [lp]);

  if (!lp) {
    return <div>Initializing Telegram Mini App...</div>;
  }

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppRoot>
  );
}

export default App;