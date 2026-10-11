/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const appendBrowserTimezoneToUrl = (url) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}timezone=${encodeURIComponent(timezone)}`;
};

const getCourseNameFromMetadata = (data) => (
  data?.name
  || data?.display_name
  || data?.course_name
  || data?.title
  || ''
);

export const useCourseName = (courseId) => {
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (!courseId) {
      return undefined;
    }
    let isMounted = true;
    const url = appendBrowserTimezoneToUrl(
      `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`,
    );
    getAuthenticatedHttpClient().get(url)
      .then(({ data }) => {
        if (isMounted) {
          setCourseName(getCourseNameFromMetadata(data) || courseId);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch course name:', error);
        if (isMounted) {
          setCourseName(courseId);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  return courseName;
};

export default useCourseName;
