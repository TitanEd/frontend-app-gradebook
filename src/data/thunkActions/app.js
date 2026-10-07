/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { appendBrowserTimezoneToUrl, normalizeCourseHomeCourseMetadata } from 'data/services/lms/utils';
import { fetchGradeOverrideHistory } from './grades';
import { fetchRoles } from './roles';
import * as module from './app';

/**
 * fetchCourseName()
 * Fetches course name from course metadata API
 * @return {Promise} - dispatch action to set course name
 */
export const fetchCourseName = () => (dispatch, getState) => {
  const courseId = selectors.app.courseId(getState());
  if (!courseId) {
    return Promise.resolve();
  }

  const url = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`;
  const urlWithTimezone = appendBrowserTimezoneToUrl(url);

  return getAuthenticatedHttpClient().get(urlWithTimezone)
    .then((response) => {
      const normalizedData = normalizeCourseHomeCourseMetadata(response.data);
      const courseName = normalizedData.name || normalizedData.displayName || '';
      if (courseName) {
        dispatch(actions.app.setCourseName(courseName));
      }
    })
    .catch((error) => {
      // Silently fail - course name is optional
      console.warn('Failed to fetch course name:', error);
    });
};

export const initialize = (courseId, urlQuery) => (dispatch) => {
  dispatch(actions.app.setCourseId(courseId));
  dispatch(actions.filters.initialize(urlQuery));
  dispatch(fetchCourseName());
  dispatch(fetchRoles());
};

export const filterMenu = StrictDict({
  close: () => (dispatch, getState) => {
    if (selectors.app.filterMenu.open(getState())) {
      dispatch(module.filterMenu.toggle());
    }
  },
  handleTransitionEnd: (event) => (dispatch) => {
    if (event.currentTarget === event.target) {
      dispatch(actions.app.filterMenu.endTransition());
    }
  },
  toggle: () => (dispatch) => {
    dispatch(actions.app.filterMenu.startTransition());
    const toggleMenu = () => dispatch(actions.app.filterMenu.toggle());
    const animationCb = () => window.setTimeout(toggleMenu);
    window.requestAnimationFrame(animationCb);
  },
});

export const setModalStateFromTable = ({ userEntry, subsection }) => (
  (dispatch) => {
    dispatch(fetchGradeOverrideHistory(subsection.module_id, userEntry.user_id));
    dispatch(actions.app.setModalStateFromTable({ subsection, userEntry }));
  }
);

export default StrictDict({
  initialize,
  filterMenu,
  setModalStateFromTable,
});
