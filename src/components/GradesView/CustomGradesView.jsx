/* eslint-disable import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';

import CustomBulkManagementControls from './BulkManagementControls/CustomBulkManagementControls';
import EditModal from './EditModal';
import FilterBadges from './FilterBadges';
import FilteredUsersLabel from './FilteredUsersLabel';
import FilterMenuToggle from './FilterMenuToggle';
import CustomGradebookTable from './GradebookTable/CustomGradebookTable';
import useGradebookTableData from './GradebookTable/hooks';
import ImportSuccessToast from './ImportSuccessToast';
import CustomInterventionsReport from './InterventionsReport/CustomInterventionsReport';
import PageButtons from './PageButtons';
import ScoreViewInput from './ScoreViewInput';
import SearchControls from './SearchControls';
import SpinnerIcon from './SpinnerIcon';
import StatusAlerts from './StatusAlerts';

import useGradesViewData from './hooks';

/**
 * <CustomGradesView />
 * Copy of <GradesView /> for the custom UI: custom report, bulk controls and
 * table (with the learner full name), plus class hooks for its styles.
 */
export const CustomGradesView = ({ updateQueryParams }) => {
  const {
    stepHeadings,
    handleFilterBadgeClose,
    mastersHint,
  } = useGradesViewData({ updateQueryParams });
  const tableData = useGradebookTableData();

  return (
    <>
      <SpinnerIcon />

      <CustomInterventionsReport />
      <h3 className="step-message-1">
        {stepHeadings.filter}
      </h3>

      <div className="d-flex justify-content-between flex-wrap">
        <FilterMenuToggle />
        <SearchControls />
      </div>

      <FilterBadges handleClose={handleFilterBadgeClose} />
      <StatusAlerts />

      <h3 className="gradebook-step-heading">{stepHeadings.gradebook}</h3>

      <div className="d-flex justify-content-between align-items-center mb-2 step-2-content">
        <ScoreViewInput />
        <CustomBulkManagementControls />
      </div>

      <FilteredUsersLabel />

      <CustomGradebookTable {...tableData} />

      <PageButtons />
      <p>* {mastersHint}</p>
      <EditModal />

      <ImportSuccessToast />
    </>
  );
};

CustomGradesView.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default CustomGradesView;
