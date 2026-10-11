import React from 'react';

import { defineMessages, useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { LmsBook } from '@openedx/paragon/icons';

import { instructorDashboardUrl } from 'data/services/lms/urls';
import getLearnerDashboardUrl from '../../utils/getLearnerDashboardUrl';
import useCourseName from './customHooks';
import useGradebookHeaderData from './hooks';
import messages from './messages';

const customHeaderMessages = defineMessages({
  loadingTitle: {
    id: 'gradebook.CustomGradebookHeader.loadingTitle',
    defaultMessage: 'Loading...',
    description: 'Fallback title while course name is loading in custom gradebook header',
  },
  myCourses: {
    id: 'gradebook.CustomGradebookHeader.myCourses',
    defaultMessage: 'My Courses',
    description: 'Breadcrumb link label back to learner dashboard my courses',
  },
});

/**
 * <CustomGradebookHeader />
 * Copy of <GradebookHeader /> for the custom UI: breadcrumb + course name
 * title instead of the "Back to Dashboard" link and course id.
 */
const CustomGradebookHeader = () => {
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
  const courseName = useCourseName(courseId);

  const displayCourseName = courseName || formatMessage(customHeaderMessages.loadingTitle);
  const openMyCourses = () => { window.location.href = getLearnerDashboardUrl('/my-courses'); };

  return (
    <>
      <div className="ca-breadcrumb-bg">
        <div className="ca-breadcrumb-container">
          <div className="ca-breadcrumb">
            <span
              className="ca-breadcrumb-icon"
              role="link"
              tabIndex={0}
              onClick={openMyCourses}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openMyCourses();
                }
              }}
            >
              <LmsBook className="custom-icon" />
              {formatMessage(customHeaderMessages.myCourses)}
            </span>
            <span className="ca-breadcrumb-divider">/</span>
            {courseName ? (
              <a href={dashboardUrl} className="ca-breadcrumb-current breadcrumb-with-pointer">
                {displayCourseName}
              </a>
            ) : (
              <span className="ca-breadcrumb-current">
                {displayCourseName}
              </span>
            )}
          </div>
          <div className="ca-title">{displayCourseName}</div>
        </div>
      </div>

      <div className="gradebook-header-title">
        <div>
          {formatMessage(messages.gradebook)}
        </div>
        <div>
          {showBulkManagement && (
            <Button variant="tertiary" onClick={handleToggleViewClick}>
              {formatMessage(toggleViewMessage)}
            </Button>
          )}
        </div>
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
    </>
  );
};

export default CustomGradebookHeader;
