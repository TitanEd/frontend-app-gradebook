/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppProvider } from '@edx/frontend-platform/react';

import FooterSlot from '@openedx/frontend-slot-footer';
import Header from '@edx/frontend-component-header';

import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';
import './App.scss';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { dynamicTheme } from 'titaned-frontend-library';
import Head from './head/Head';
import Layout from './Layout';
import { setUIPreference } from './services/uiPreferenceService';

// Load styles only for new UI
const loadStylesForNewUI = (isOldUI) => {
  document.body.className = isOldUI ? 'old-ui' : 'new-ui';
  document.documentElement.className = isOldUI ? 'old-ui' : 'new-ui';

  if (!isOldUI) {
    import('titaned-frontend-library/dist/index.css');
    import('./styles/styles-overrides.scss');
  } else {
    import('./styles/old-ui.scss');
  }
};

const App = () => {
  const [oldUI, setOldUI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuConfig, setMenuConfig] = useState(null);

  // Load UI preference and menu config in one API call to avoid race conditions
  useEffect(() => {
    const loadUIPreferenceAndMenuConfig = async () => {
      try {
        // First, load from localStorage for immediate display
        const localStorageValue = localStorage.getItem('oldUI') || 'false';
        setOldUI(localStorageValue);
        setLoading(false);

        // Then, fetch both UI preference and menu config in one API call
        const response = await getAuthenticatedHttpClient().get(`${getConfig().STUDIO_BASE_URL}/titaned/api/v1/menu-config/`);

        if (response.status === 200 && response.data) {
          setMenuConfig(response.data);

          // Extract UI preference from the same response
          const useNewUI = response.data.use_new_ui === true;
          const apiOldUIValue = !useNewUI ? 'true' : 'false';

          // Check if API response matches localStorage
          if (localStorageValue !== apiOldUIValue) {
            localStorage.setItem('oldUI', apiOldUIValue);
            // Reload page to re-run build-time config with correct localStorage
            window.location.reload();
            return;
          }

          console.log('localStorage and API are in sync, no reload needed');
        } else {
          console.warn('API failed, using localStorage value and default menu config');
          setMenuConfig({}); // Set empty object as fallback
        }
      } catch (error) {
        console.error('API call failed, using localStorage value and default menu config:', error);
        setMenuConfig({}); // Set empty object as fallback
      }
    };

    loadUIPreferenceAndMenuConfig();
  }, []);

  // Apply theme from API
  useEffect(() => {
    if (oldUI === 'false') {
      (async () => {
        try {
          const response = await getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/titaned/api/v1/mfe_context/`);
          dynamicTheme(response);
        } catch (error) {
          console.error('Error fetching theme config:', error);
        }
      })();
    }
  }, [oldUI]);

  useEffect(() => {
    // Only load styles after we know the UI preference
    if (oldUI !== null) {
      loadStylesForNewUI(oldUI === 'true');
    }
  }, [oldUI]);

  // Show loading screen while UI preference is being fetched
  if (loading || menuConfig === null) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column vh-100">
        <div>Loading... Please wait...</div>
      </div>
    );
  }

  return (
    <AppProvider store={store}>
      {oldUI === 'false' ? (
        <>
          <Head />
          <Routes>
            <Route
              path="/"
              element={<Layout />}
            >
              <Route
                path="/:courseId"
                element={<GradebookPage />}
              />
            </Route>
          </Routes>
        </>
      ) : (
        <>
          <Head />
          <div>
            <div>
              <Header />
              <button
                type="button"
                className="ui-switch-button"
                onClick={async () => {
                  try {
                    const success = await setUIPreference(true);
                    if (success) {
                      window.location.reload();
                    } else {
                      console.error('Failed to switch to new UI');
                    }
                  } catch (error) {
                    console.error('Error switching to new UI:', error);
                  }
                }}
              >
                Switch to New UI
              </button>
            </div>
            <main>
              <Routes>
                <Route
                  path="/:courseId"
                  element={<GradebookPage />}
                />
              </Routes>
            </main>
            <FooterSlot />
          </div>
        </>
      )}
    </AppProvider>
  );
};

export default App;
