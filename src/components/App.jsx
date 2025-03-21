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

  // Store user in state
  const [user, setUser] = useState(lp.initData.user);

  useEffect(() => {
    setUser(lp.initData.user);
  }, [lp]);


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