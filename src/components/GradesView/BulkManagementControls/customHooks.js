import { useCallback } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import { StrictDict } from 'utils';
import { filters } from 'data/constants/filters';
import urls from 'data/services/lms/urls';

export const events = StrictDict({
  exportGrades: 'edx.ui.lms.gradebook.bulk_management.export_grades_button.clicked',
});

export const useCustomBulkManagementControls = () => {
  const courseId = window.location.pathname.split('/').filter(Boolean).pop() || '';

  const handleClickExportGrades = useCallback(async () => {
    sendTrackEvent(events.exportGrades, { course_id: courseId });
    const cohort = document.getElementById('Cohorts')?.value;
    const track = document.getElementById('Tracks')?.value;
    const gradeExportUrl = urls.gradeCsvUrl({
      [filters.cohort]: cohort && cohort !== 'Cohort-All' ? cohort : undefined,
      [filters.track]: track && track !== 'Track-All' ? track : undefined,
    });

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
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to export grades:', error);
    }
  }, [courseId]);

  return { handleClickExportGrades };
};

export default useCustomBulkManagementControls;
