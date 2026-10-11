/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import queryString from 'query-string';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { views } from 'data/constants/app';

import CustomWithSidebar from 'components/WithSidebar/CustomWithSidebar';
import CustomGradebookHeader from 'components/GradebookHeader/CustomGradebookHeader';
import CustomGradesView from 'components/GradesView/CustomGradesView';
import GradebookFilters from 'components/GradebookFilters';
import BulkManagementHistoryView from 'components/BulkManagementHistoryView';

/**
 * <CustomGradebookPage />
 * Copy of <GradebookPage /> for the custom UI (same data flow, custom header,
 * grades view and filter panel wrapper).
 */
const CustomGradebookPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeView = useSelector(selectors.app.activeView);

  useEffect(() => {
    dispatch(thunkActions.app.initialize(courseId, queryString.parse(location.search)));
    // Initialize once per course, like GradebookPage.componentDidMount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const updateQueryParams = (queryParams) => {
    const parsed = queryString.parse(location.search);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        parsed[key] = queryParams[key];
      } else {
        delete parsed[key];
      }
    });
    navigate({ pathname: location.pathname, search: `?${queryString.stringify(parsed)}` });
  };

  return (
    <CustomWithSidebar
      sidebar={<GradebookFilters updateQueryParams={updateQueryParams} />}
    >
      <div className="gradebook-content">
        <CustomGradebookHeader />
        {(activeView === views.bulkManagementHistory
          ? <BulkManagementHistoryView />
          : <CustomGradesView updateQueryParams={updateQueryParams} />
        )}
      </div>
    </CustomWithSidebar>
  );
};

export default CustomGradebookPage;
