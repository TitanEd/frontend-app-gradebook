/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';

import NetworkButton from 'components/NetworkButton';
import ImportGradesButton from '../ImportGradesButton';

import { useBulkManagementControls } from './hooks'; // Changed to correct hook name
import messages from './messages';

/**
 * <BulkManagementControls />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redux.
 */
export const BulkManagementControls = () => {
  const {
    show,
    handleClickExportGrades,
  } = useBulkManagementControls();

  if (!show) { return null; }
  return (
    <div className="d-flex">
      <NetworkButton
        label={messages.downloadGradesBtn}
        onClick={handleClickExportGrades}
      />
      <ImportGradesButton />
    </div>
  );
};

export default BulkManagementControls;
