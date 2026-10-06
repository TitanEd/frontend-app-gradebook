import queryString from 'query-string';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { filters } from 'data/constants/filters';

/**
 * get(url)
 * simple wrapper providing an authenticated Http client get action
 * @param {string} url - target url
 */
export const get = (...args) => getAuthenticatedHttpClient().get(...args);
/**
 * post(url, data)
 * simple wrapper providing an authenticated Http client post action
 * @param {string} url - target url
 * @param {object|string} data - post payload
 */
export const post = (...args) => getAuthenticatedHttpClient().post(...args);

/**
 * stringifyUrl(url, query)
 * simple wrapper around queryString.stringifyUrl that sets skip behavior
 * @param {string} url - base url string
 * @param {object} query - query parameters
 */
export const stringifyUrl = (url, query) => queryString.stringifyUrl(
  { url, query },
  { skipNull: true, skipEmptyString: true },
);

/**
 * filterQuery(options)
 * Takes current filter object and returns it with only valid filters that are
 * set and have non-'All' values
 * @param {object} options - filter values
 * @return {object} - valid filters that are set and do not equal 'All'
 */
export const filterQuery = (options) => Object.values(filters)
  .filter(filter => options[filter] && options[filter] !== 'All')
  .reduce(
    (obj, filter) => ({ ...obj, [filter]: options[filter] }),
    {},
  );

/**
 * appendBrowserTimezoneToUrl(url)
 * Appends browser timezone to URL as query parameter
 * @param {string} url - base url string
 * @return {string} - url with timezone query parameter
 */
export const appendBrowserTimezoneToUrl = (url) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}timezone=${encodeURIComponent(timezone)}`;
};

/**
 * normalizeCourseHomeCourseMetadata(data, rootSlug)
 * Normalizes course metadata response and extracts course information
 * @param {object} data - raw course metadata response
 * @param {string} rootSlug - root slug (optional)
 * @return {object} - normalized course metadata
 */
export const normalizeCourseHomeCourseMetadata = (data, rootSlug = '') => {
  // Extract course name from various possible fields
  const courseName = data?.name
    || data?.display_name
    || data?.course_name
    || data?.title
    || '';

  return {
    name: courseName,
    displayName: courseName,
    rootSlug: rootSlug || data?.rootSlug || '',
    ...data,
  };
};