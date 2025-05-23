import { StrictDict } from 'utils';

import urls, {
  gradeCsvUrl,
  sectionOverrideHistoryUrl,
} from './urls';
import { pageSize, paramKeys } from './constants';
import messages from './messages';

import * as utils from './utils';

const { get, post, stringifyUrl } = utils;

/*********************************************************************************
 * GET Actions
 *********************************************************************************/
const assignmentTypes = () => get(urls.getAssignmentTypesUrl());
const cohorts = () => get(urls.getCohortsUrl());
const roles = () => get(urls.getRolesUrl());
const tracks = () => get(urls.getTracksUrl());

/**
 * fetch.gradebookData(searchText, cohort, track, options)
 * fetches updated gradebook data based on current filter selections.
 * Raises an error if assignment grade limits are set, but not assignment.
 * @param {string} searchText - search text filter
 * @param {number} cohort - selected cohort filter
 * @param {string} track - selected track filter
 * @param {object} options - additional optional filter values
 * @return {Promise} - get response
 */
const gradebookData = (searchText, cohort, track, options = {}) => {
  if ((options.assignmentGradeMax || options.assignmentGradeMin) && !options.assignment) {
    throw new Error(messages.errors.missingAssignment);
  }
  const queryParams = {
    [paramKeys.pageSize]: options.page_size || pageSize,
    [paramKeys.userContains]: searchText || null,
    [paramKeys.cohortId]: options.cohort_id || cohort || null,
    [paramKeys.track]: track || null,
    [paramKeys.courseGradeMax]: options.courseGradeMax || null,
    [paramKeys.courseGradeMin]: options.courseGradeMin || null,
    [paramKeys.excludedCourseRoles]: options.includeCourseRoleMembers ? null : ['all'],
    [paramKeys.assignment]: options.assignment || null,
    [paramKeys.assignmentGradeMax]: options.assignmentGradeMax || null,
    [paramKeys.assignmentGradeMin]: options.assignmentGradeMin || null,
  };
  // Filter out null or undefined values to avoid invalid query parameters
  /* eslint-disable no-unused-vars */
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value != null),
  );
  return get(stringifyUrl(urls.getGradebookUrl(), filteredQueryParams));
};

/**
 * fetch.gradeBulkOperationHistory()
 * fetches bulk operation history and raises an error if the operation fails
 * @return {Promise} - get response
 */
const gradeBulkOperationHistory = () => get(urls.getBulkHistoryUrl())
  .then(response => response.data)
  .catch(() => Promise.reject(Error(messages.errors.unhandledResponse)));

/**
 * fetch.gradeOverrideHistory(subsectionId, userId)
 * fetches grade override history for a given user on a given subsection
 * @param {string} subsectionId - subsection identifier
 * @param {string} userId - user identifier
 * @return {Promise} - get response
 */
const gradeOverrideHistory = (subsectionId, userId) => (
  get(sectionOverrideHistoryUrl(subsectionId, userId))
);

/*********************************************************************************
 * POST Actions
 *********************************************************************************/
/**
 * updateGradebookData(updateData)
 * sends an update message with new grades overrides
 * @param {object[]} updateData
 *  {
 *    user_id: <int>,
 *    usage_id: <string>
 *    grade: {
 *      earned_all_override: <int>
 *      possible_all_override: <int>
 *      earned_graded_override: <int>
 *      possible_graded_override: <int>
 *    }
 *  }
 * @return {Promise} - post response
 */
const updateGradebookData = (updateData) => post(urls.getBulkUpdateUrl(), updateData);

/**
 * uploadGradeCsv(formData)
 * Posts form data to grade csv url.  On success, forwards response data.
 * Reject promise with result on failure.
 * @param {object} formData - new grade data
 * @return {Promise} - post response
 */
const uploadGradeCsv = (formData) => (
  post(gradeCsvUrl(), formData).then((result) => {
    if (result.status === 200 && !result.data.error_messages.length) {
      return result.data;
    }
    return Promise.reject(result);
  })
);

export default StrictDict({
  fetch: StrictDict({
    assignmentTypes,
    cohorts,
    gradebookData,
    gradeBulkOperationHistory,
    gradeOverrideHistory,
    roles,
    tracks,
  }),
  updateGradebookData,
  uploadGradeCsv,
});
