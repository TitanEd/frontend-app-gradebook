import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
}));

jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: ({ children }) => children,
}));

jest.mock('@edx/frontend-component-header', () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

jest.mock('@edx/frontend-component-footer', () => ({
  FooterSlot: () => <div>Footer</div>,
}));

jest.mock('./head/Head', () => ({
  __esModule: true,
  default: () => <div>Head</div>,
}));

jest.mock('./Layout', () => ({
  __esModule: true,
  default: () => <div>Layout</div>,
}));

jest.mock('containers/GradebookPage', () => ({
  __esModule: true,
  default: () => <div>Gradebook</div>,
}));

jest.mock('titaned-frontend-library', () => ({
  dynamicTheme: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    STUDIO_BASE_URL: 'http://studio.example',
    LMS_BASE_URL: 'http://lms.example',
  }),
}));

const mockGet = jest.fn();
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => ({ get: mockGet }),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    mockGet.mockReset();
    mockGet.mockResolvedValue({ status: 200, data: { use_new_ui: true } });
  });

  it('shows a loading state before the UI preference is known', () => {
    render(<App />);
    expect(screen.getByText('Loading... Please wait...')).toBeInTheDocument();
  });

  it('renders the new UI layout when oldUI is false', async () => {
    localStorage.setItem('oldUI', 'false');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Head')).toBeInTheDocument();
    });
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.queryByText('Header')).not.toBeInTheDocument();
  });

  it('renders the old UI header and footer when oldUI is true', async () => {
    localStorage.setItem('oldUI', 'true');
    mockGet.mockResolvedValue({ status: 200, data: { use_new_ui: false } });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Header')).toBeInTheDocument();
    });
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Gradebook')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to New UI' })).toBeInTheDocument();
    expect(screen.queryByText('Layout')).not.toBeInTheDocument();
  });
});
