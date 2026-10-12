/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DataTable } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { bulkManagementColumns } from 'data/constants/app';
import selectors from 'data/selectors';

import ResultsSummary from './ResultsSummary';
import messages from './messages';

export const mapHistoryRows = ({
  resultsSummary,
  originalFilename,
  user,
  ...rest
}) => ({
  resultsSummary: (<ResultsSummary {...resultsSummary} />),
  filename: (<span className="wrap-text-in-cell">{originalFilename}</span>),
  user: (<span className="wrap-text-in-cell">{user}</span>),
  ...rest,
});

/**
 * <HistoryTable />
 * Table with history of bulk management uploads, including a results summary which
 * displays total, skipped, and failed uploads
 */
export const HistoryTable = ({
  bulkManagementHistory,
}) => {
  const { formatMessage } = useIntl();
  // Column headers in the language of the page (the constants hold the English ones).
  const columns = bulkManagementColumns.map((column) => {
    const message = messages[`${column.accessor}Header`];
    return message ? { ...column, Header: formatMessage(message) } : column;
  });
  return (
    <DataTable
      data={bulkManagementHistory.map(mapHistoryRows)}
      hasFixedColumnWidths
      columns={columns}
      className="table-striped"
      itemCount={bulkManagementHistory.length}
    />
  );
};
HistoryTable.defaultProps = {
  bulkManagementHistory: [],
};
HistoryTable.propTypes = {
  // redux
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    originalFilename: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    timeUploaded: PropTypes.string.isRequired,
    resultsSummary: PropTypes.shape({
      rowId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    }),
  })),
};

export const mapStateToProps = (state) => ({
  bulkManagementHistory: selectors.grades.bulkManagementHistoryEntries(state),
});

export default connect(mapStateToProps)(HistoryTable);
