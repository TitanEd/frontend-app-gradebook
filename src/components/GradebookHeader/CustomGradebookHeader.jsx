/* eslint-disable react/prop-types */
import { Button } from '@openedx/paragon';
import { LmsBook } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import React from 'react';
import useGradebookHeaderData from './hooks';

const CustomGradebookHeader = (props) => {
  const {
    formatMessage,
    messages,
    courseId,
    showBulkManagement,
    handleToggleViewClick,
    toggleViewMessage,
    areGradesFrozen,
    canUserViewGradebook,
    dashboardUrl,
  } = props;

  const { courseName } = useGradebookHeaderData();

  // Display course name if available, otherwise fall back to courseId
  const displayCourseName = courseName || 'Loading...';
  const isLoading = displayCourseName === 'Loading...';
  const isClickable = !isLoading && dashboardUrl;
  const myCoursesUrl = `https://${getConfig().BASE_URL}/learner-dashboard/my-courses`;

  return (
    <>
      <div className="ca-breadcrumb-bg">
        <div className="ca-breadcrumb-container">
          <div className="ca-breadcrumb">
            <span className="ca-breadcrumb-icon" onClick={() => window.location.href = myCoursesUrl}>
              <LmsBook className="custom-icon" />
              My Courses
            </span>
            <span className="ca-breadcrumb-divider">/</span>
            {isClickable ? (
              <a
                href={dashboardUrl}
                className="ca-breadcrumb-current breadcrumb-with-pointer"
                style={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                //   color: 'inherit',
                }}
              >
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
