import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppProvider } from '@edx/frontend-platform/react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import { FooterSlot } from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';
import './App.scss';
import Head from './head/Head';

const App = () => (
  <AppProvider store={store}>
    <Head />
    <PluginSlot id="app_layout_plugin_slot">
      <div>
        <Header />
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
    </PluginSlot>
  </AppProvider>
);

export default App;
