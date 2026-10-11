import React from 'react';

import NetworkButton from 'components/NetworkButton';
import { selectors } from 'data/redux/hooks';
import ImportGradesButton from '../ImportGradesButton';

import useCustomBulkManagementControls from './customHooks';
import messages from './messages';

/**
 * <CustomBulkManagementControls />
 * Copy of <BulkManagementControls /> for the custom UI: the grade export
 * downloads the CSV for the selected cohort / track (customHooks.js).
 */
const CustomBulkManagementControls = () => {
  const show = selectors.root.useShowBulkManagement();
  const { handleClickExportGrades } = useCustomBulkManagementControls();

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

export default CustomBulkManagementControls;
