import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * TELS: full name and e-mail of the learners of a gradebook page.
 *
 * The platform's gradebook API sends `full_name` and `email` only for learners in the Master's
 * track. Control Hub's /titaned/api/v2/gradebook-learners/<course>/ answers them for the course
 * team (same access as the gradebook). Learners it does not know keep what the platform sent;
 * when the call fails the page is shown without them.
 */
const courseId = () => window.location.pathname.split('/').filter(Boolean).pop() || '';

export const learnerDetailsUrl = () => (
  `${getConfig().LMS_BASE_URL}/titaned/api/v2/gradebook-learners/${courseId()}/`
);

/**
 * withLearnerDetails(data)
 * @param {object} data - a page of the gradebook API ({ results: [{ username, ... }], ... })
 * @return {Promise<object>} - the same page with `full_name` and `email` filled in
 */
export const withLearnerDetails = (data) => {
  const results = data?.results;
  if (!Array.isArray(results) || !results.length) {
    return Promise.resolve(data);
  }
  const usernames = results.map(({ username }) => username).filter(Boolean);
  // Inside a promise chain: a failure of any kind (also a synchronous one) leaves the page as is.
  return Promise.resolve()
    .then(() => getAuthenticatedHttpClient().get(
      learnerDetailsUrl(),
      { params: { usernames: usernames.join(',') } },
    ))
    .then(({ data: answer }) => {
      const details = answer?.results || {};
      return {
        ...data,
        results: results.map((entry) => {
          const found = details[entry.username];
          if (!found) {
            return entry;
          }
          return {
            ...entry,
            full_name: entry.full_name || found.full_name || '',
            email: entry.email || found.email || '',
          };
        }),
      };
    })
    .catch(() => data);
};

export default withLearnerDetails;
