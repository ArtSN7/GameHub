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
import { useEffect, useMemo, createContext, useState, useContext } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { routes } from '@/navigation/routes.jsx';

// Create a User Context
const UserContext = createContext();

export function App() {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  console.log('Backend URL:', backendUrl);
  

  useEffect(() => {
    // Ensure Telegram WebApp is ready
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
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
    if (!lp) {
      console.warn('No launch parameters available');
    }
  }, [lp]);

  if (!lp) {
    return <div>Initializing Telegram Mini App...</div>;
  }

  // Store user in state (both Telegram user and database user)
  const [user, setUser] = useState({
    telegramUser: lp.initData.user, // Telegram user data
    dbUser: null, // Database user data (including id)
  });

  // Sync user with the backend
  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!lp.initData.user) {
        console.warn('No user data available in launch parameters');
        return;
      }

      const { id: telegramId, username } = lp.initData.user;
      try {
        const response = await fetch(`${backendUrl}/api/sync_user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: telegramId.toString(), username }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync user with backend');
        }

        const dbUser = await response.json();
        setUser((prev) => ({
          ...prev,
          dbUser, // Store the database user data (including id)
        }));
      } catch (error) {
        console.error('Error syncing user with backend:', error);
      }
    };

    syncUserWithBackend();
  }, [lp]);

  if (!user.dbUser) {
    return <div>Syncing user with backend...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AppRoot
        appearance={lp.miniApp?.isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
      >
        <Router location={location} navigator={reactNavigator}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AppRoot>
    </UserContext.Provider>
  );
}

// Custom hook to access user data anywhere
export const useUser = () => useContext(UserContext);

export default App;