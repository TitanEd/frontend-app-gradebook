import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  label: {
    id: 'gradebook.GradesView.search.label',
    defaultMessage: 'Search for a learner',
    description: 'Text prompting a user to use this functionality to search for a learner',
  },
  submitButton: {
    id: 'gradebook.GradesView.search.submitButton',
    defaultMessage: 'Submit search',
    description: 'Screen reader label of the button that starts the learner search',
  },
  clearButton: {
    id: 'gradebook.GradesView.search.clearButton',
    defaultMessage: 'Clear search',
    description: 'Screen reader label of the button that empties the learner search box',
  },
  hint: {
    id: 'gradebook.GradesView.search.hint',
    defaultMessage: 'Search by username, email, or student key',
    description: 'A hint explaining the ways a user can search',
  },
});

export default messages;
