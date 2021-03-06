import React from 'react';
import PropTypes from 'prop-types';

const HeaderCharts = ({ name, description }) => {
  return (
      <header>
        <h3>{name}</h3>
        <small>{description}</small>
      </header>
  );
};

HeaderCharts.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default HeaderCharts;
