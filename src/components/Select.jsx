import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ children, onChange }) => {
  return (
    <select
      onChange={onChange}
      className="form-control custom-select"
      style={{ marginTop: 24 }}
    >
      {children}
    </select>
  );
};

Select.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  onChange: PropTypes.func
};

Select.defaultProps = {
  onChange: () => {}
};

export default Select;
