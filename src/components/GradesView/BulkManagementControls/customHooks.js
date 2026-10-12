import { useCallback } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';

import { StrictDict } from 'utils';
import { filters } from 'data/constants/filters';
import urls from 'data/services/lms/urls';
import filterMessages from 'components/GradebookFilters/messages';

export const events = StrictDict({
  exportGrades: 'edx.ui.lms.gradebook.bulk_management.export_grades_button.clicked',
});

export const useCustomBulkManagementControls = () => {
  const courseId = window.location.pathname.split('/').filter(Boolean).pop() || '';
  const { formatMessage } = useIntl();

  const handleClickExportGrades = useCallback(async () => {
    sendTrackEvent(events.exportGrades, { course_id: courseId });
    // The "all" option of both selects has its translated label as value.
    const selectedGroup = (id, allLabel) => {
      const value = document.getElementById(id)?.value;
      return value && value !== allLabel ? value : undefined;
    };
    const gradeExportUrl = urls.gradeCsvUrl({
      [filters.cohort]: selectedGroup('Cohorts', formatMessage(filterMessages.cohortAll)),
      [filters.track]: selectedGroup('Tracks', formatMessage(filterMessages.trackAll)),
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
  }, [courseId, formatMessage]);

  return { handleClickExportGrades };
};

export default useCustomBulkManagementControls;
