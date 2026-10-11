import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import './CustomWithSidebar.scss';

/**
 * CustomWithSidebar
 * Copy of <WithSidebar /> for the custom UI. Same behavior, but its class names
 * (with-sidebar*) do not collide with the custom layout navigation sidebar.
 */
export const CustomWithSidebar = ({
  children,
  sidebar,
  open,
  isClosed,
  isOpening,
  handleSlideDone,
}) => (
  <div className="d-flex with-sidebar-container page-gradebook">
    <aside
      className={classNames('with-sidebar', { open, 'd-none': isClosed })}
      onTransitionEnd={handleSlideDone}
    >
      {sidebar}
    </aside>
    <div className={classNames('with-sidebar-contents', 'position-relative', { opening: isOpening })}>
      {children}
    </div>
  </div>
);

CustomWithSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  sidebar: PropTypes.node.isRequired,
  // redux
  isClosed: PropTypes.bool.isRequired,
  isOpening: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  handleSlideDone: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  open: selectors.app.filterMenu.open(state),
  isClosed: selectors.app.filterMenu.isClosed(state),
  isOpening: selectors.app.filterMenu.isOpening(state),
});

export const mapDispatchToProps = {
  handleSlideDone: thunkActions.app.filterMenu.handleTransitionEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomWithSidebar);
