/* eslint-disable react/prop-types */
import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';

import { Headings } from 'data/constants/grades';

import messages from './messages';

const CustomGradebookTable = ({
  columns,
  data,
  grades,
  nullMethod,
  emptyContent,
}) => {
  const { formatMessage } = useIntl();
  const fullNameFallback = formatMessage(messages.fullNameNotAvailable);

  // TELS fills the name and e-mail of every learner (data/services/lms/learnerDetails.js), so
  // these two headings lose the "Master's track only" asterisk of the stock table.
  const plainHeadings = {
    [Headings.email]: formatMessage(messages.emailHeading),
    [Headings.fullName]: formatMessage(messages.fullNameHeading),
  };
  const tableColumns = columns.map((column) => (
    plainHeadings[column.accessor] ? { ...column, Header: plainHeadings[column.accessor] } : column
  ));

  const rows = data.map((row, index) => ({
    ...row,
    [Headings.fullName]: grades[index]?.full_name || fullNameFallback,
  }));

  return (
    <div className="gradebook-container">
      <DataTable
        columns={tableColumns}
        data={rows}
        rowHeaderColumnKey="username"
        hasFixedColumnWidths
        itemCount={grades.length}
        RowStatusComponent={nullMethod}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content={emptyContent} />
      </DataTable>
    </div>
  );
};

export default CustomGradebookTable;
