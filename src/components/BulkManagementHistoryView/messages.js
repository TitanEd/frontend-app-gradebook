import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  heading: {
    id: 'gradebook.BulkManagementHistoryView.heading',
    defaultMessage: 'Bulk Management History',
    description: 'Heading text for BulkManagement History Tab',
  },
  helpText: {
    id: 'gradebook.BulkManagementHistoryView',
    defaultMessage: 'Below is a log of previous grade imports. To download a CSV of your gradebook and import grades for override, return to the Gradebook. Please note, after importing grades, it may take a few seconds to process the override.',
    description: 'Bulk Management History View help text',
  },
  filenameHeader: {
    id: 'gradebook.BulkManagementHistoryView.table.filename',
    defaultMessage: 'Gradebook',
    description: 'Bulk Management History table: header of the column with the uploaded file name',
  },
  resultsSummaryHeader: {
    id: 'gradebook.BulkManagementHistoryView.table.resultsSummary',
    defaultMessage: 'Download Summary',
    description: 'Bulk Management History table: header of the column with the link to the results summary',
  },
  userHeader: {
    id: 'gradebook.BulkManagementHistoryView.table.user',
    defaultMessage: 'Who',
    description: 'Bulk Management History table: header of the column with the user who uploaded the file',
  },
  timeUploadedHeader: {
    id: 'gradebook.BulkManagementHistoryView.table.timeUploaded',
    defaultMessage: 'When',
    description: 'Bulk Management History table: header of the column with the upload time',
  },
  successDialog: {
    id: 'gradebook.BulkManagementHistoryView.successDialog',
    defaultMessage: 'CSV processing. File uploads may take several minutes to complete.',
    description: 'Success Dialog message in BulkManagement Tab File Upload Form',
  },
});

export default messages;
