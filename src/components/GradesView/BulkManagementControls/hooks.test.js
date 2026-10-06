import { renderHook, act } from '@testing-library/react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import { selectors } from 'data/redux/hooks';
import urls from '../../../data/services/lms/urls';
import { events, useBulkManagementControls } from './hooks';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useShowBulkManagement: jest.fn(),
    },
  },
}));

jest.mock('../../../data/services/lms/urls', () => ({
  __esModule: true,
  default: {
    gradeCsvUrl: jest.fn(() => 'http://lms.example/grades.csv'),
  },
}));

const appendSelect = (id, value) => {
  const select = document.createElement('select');
  select.id = id;
  const option = document.createElement('option');
  option.value = value;
  select.appendChild(option);
  document.body.appendChild(select);
};

describe('useBulkManagementControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    selectors.root.useShowBulkManagement.mockReturnValue(true);
    window.history.pushState({}, '', '/gradebook/course-v1:edX+Demo+2024');
    appendSelect('Cohorts', 'cohort-1');
    appendSelect('Tracks', 'audit');
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      blob: () => Promise.resolve(new Blob(['csv'])),
    });
    global.URL.createObjectURL = jest.fn(() => 'blob:grades');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('forwards show from showBulkManagement', () => {
    const { result, rerender } = renderHook(() => useBulkManagementControls());
    expect(result.current.show).toEqual(true);
    selectors.root.useShowBulkManagement.mockReturnValue(false);
    rerender();
    expect(result.current.show).toEqual(false);
  });

  it('downloads a filtered grade csv for the selected cohort and track', async () => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { result } = renderHook(() => useBulkManagementControls());

    await act(async () => {
      await result.current.handleClickExportGrades();
    });

    expect(sendTrackEvent).toHaveBeenCalledWith(events.exportGrades, {
      course_id: 'course-v1:edX+Demo+2024',
    });
    expect(urls.gradeCsvUrl).toHaveBeenCalledWith({
      excluded_course_roles: ['all'],
      cohort: 'cohort-1',
      track: 'audit',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://lms.example/grades.csv', {
      method: 'GET',
      credentials: 'include',
    });
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });
});
