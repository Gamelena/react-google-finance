import React from 'react';
import PropTypes from 'prop-types';

import '../assets/stylesheets/base.scss';


const HeaderCharts = ({ name }) => {
  return (
    <h1>{name}</h1>
  );
};

HeaderCharts.propTypes = {
  name: PropTypes.string,
};

export default HeaderCharts;
