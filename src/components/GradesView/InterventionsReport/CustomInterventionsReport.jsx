import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import NetworkButton from 'components/NetworkButton';

import messages from './messages';
import useInterventionsReportData from './hooks';

/**
 * <CustomInterventionsReport />
 * Copy of <InterventionsReport /> for the custom UI, with class hooks for its styles.
 */
export const CustomInterventionsReport = () => {
  const { show, handleClick } = useInterventionsReportData();
  const { formatMessage } = useIntl();

  if (!show) {
    return null;
  }

  return (
    <div>
      <h4 className="mt-0 intervention-report-title">
        {formatMessage(messages.title)}
      </h4>
      <div className="d-flex justify-content-between align-items-center mobile-view-intervention-report">
        <div className="intervention-report-description">
          {formatMessage(messages.description)}
        </div>
        <NetworkButton
          label={messages.downloadBtn}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default CustomInterventionsReport;
