import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import { instructorDashboardUrl } from 'data/services/lms/urls';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import useGradebookHeaderData from './hooks';
import messages from './messages';

export const GradebookHeader = () => {
  const { formatMessage } = useIntl();
  const {
    areGradesFrozen,
    canUserViewGradebook,
    courseId,
    handleToggleViewClick,
    showBulkManagement,
    toggleViewMessage,
  } = useGradebookHeaderData();
  const dashboardUrl = instructorDashboardUrl();
  return (
    <div className="gradebook-header">
      <PluginSlot
        id="gradebook_header_plugin_slot"
        pluginProps={{
          dashboardUrl,
          formatMessage,
          messages,
          courseId,
          showBulkManagement,
          handleToggleViewClick,
          toggleViewMessage,
          areGradesFrozen,
          canUserViewGradebook,
        }}
      >
        <a href={dashboardUrl} className="mb-3">
          <span aria-hidden="true">{'<< '}</span>
          {formatMessage(messages.backToDashboard)}
        </a>
        <h1>{formatMessage(messages.gradebook)}</h1>
        <div className="subtitle-row d-flex justify-content-between align-items-center">
          <h2 className="text-break">{courseId}</h2>
          {showBulkManagement && (
          <Button variant="tertiary" onClick={handleToggleViewClick}>
            {formatMessage(toggleViewMessage)}
          </Button>
          )}
        </div>
        {areGradesFrozen && (
        <div className="alert alert-warning" role="alert">
          {formatMessage(messages.frozenWarning)}
        </div>
        )}
        {(canUserViewGradebook === false) && (
        <div className="alert alert-warning" role="alert">
          {formatMessage(messages.unauthorizedWarning)}
        </div>
        )}
      </PluginSlot>
    </div>
  );
};

export default GradebookHeader;
