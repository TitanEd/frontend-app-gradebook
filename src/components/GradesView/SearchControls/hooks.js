import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors, thunkActions } from 'data/redux/hooks';

import messages from './messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const useSearchControlsData = () => {
  const { formatMessage } = useIntl();
  const searchValue = selectors.app.useSearchValue();
  const fetchGrades = thunkActions.grades.useFetchGrades();
  const setSearchValue = actions.app.useSetSearchValue();

  const onBlur = (e) => {
    setSearchValue(e.target.value);
  };

  const onClear = () => {
    setSearchValue('');
    fetchGrades();
  };

  const onSubmit = (newValue) => {
    setSearchValue(newValue);
    fetchGrades();
  };

  return {
    onSubmit,
    onBlur,
    onClear,
    searchValue,
    inputLabel: formatMessage(messages.label),
    screenReaderText: {
      label: formatMessage(messages.label),
      submitButton: formatMessage(messages.submitButton),
      clearButton: formatMessage(messages.clearButton),
    },
    hintText: formatMessage(messages.hint),
  };
};

export default useSearchControlsData;
