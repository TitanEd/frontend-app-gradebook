import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { StrictDict } from '@edx/react-unit-test-utils';
import urls from '../../../data/services/lms/urls';
import { paramKeys } from '../../../data/services/lms/constants';

export const events = StrictDict({
  exportGrades: 'edx.ui.lms.gradebook.bulk_management.export_grades_button.clicked',
});

export const useBulkManagementControls = () => {
  const courseId = window.location.pathname.split('/').filter(Boolean).pop() || '';
  const show = useSelector(state => state.gradebook?.showBulkManagement ?? true);

  const handleClickExportGrades = useCallback(async () => {
    sendTrackEvent(events.exportGrades, { course_id: courseId });
    const cohort = document.getElementById('Cohorts')?.value;
    const track = document.getElementById('Tracks')?.value;
    const options = {
      [paramKeys.excludedCourseRoles]: ['all'],
      [paramKeys.cohort]: cohort && cohort !== 'Cohort-All' ? cohort : undefined,
      [paramKeys.track]: track && track !== 'Track-All' ? track : undefined,
    };
    const gradeExportUrl = urls.gradeCsvUrl(options);

    try {
      const response = await fetch(gradeExportUrl, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grades_${courseId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Replace with notification system e.g. dispatch(showNotification(`Error: ${response.statusText}`))
      }
    } catch (error) {
      // Replace with notification system e.g. dispatch(showNotification(`Error: ${error.message}`))
    }
  }, [courseId]);

  return { show, handleClickExportGrades };
};
