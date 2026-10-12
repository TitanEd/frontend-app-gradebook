import { createAction } from '@reduxjs/toolkit';
import { getLocale } from '@edx/frontend-platform/i18n';

export const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};
export const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
};

// Language of the page; English when i18n is not configured (unit tests).
const pageLocale = () => {
  try {
    return getLocale();
  } catch (error) {
    return 'en';
  }
};

const formatDateForDisplay = (inputDate) => {
  // Other languages: the browser's own date-time pattern of the page language.
  const locale = pageLocale();
  if (locale && !locale.startsWith('en')) {
    return inputDate.toLocaleString(locale, { ...options, ...timeOptions });
  }
  const date = inputDate.toLocaleDateString('en-US', options);
  const time = inputDate.toLocaleTimeString('en-US', timeOptions);
  return `${date} at ${time}`;
};

const sortAlphaAsc = (gradeRowA, gradeRowB) => {
  const a = gradeRowA.username.toUpperCase();
  const b = gradeRowB.username.toUpperCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const createActionFactory = (dataKey) => (actionKey, ...args) => (
  createAction(`${dataKey}/${actionKey}`, ...args)
);

export {
  createActionFactory,
  sortAlphaAsc,
  formatDateForDisplay,
};
