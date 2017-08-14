import React from 'react';
import { render } from 'react-dom';
import HeaderCharts from './components/HeaderCharts';
import FinancialCharts from './components/FinancialCharts';

render(<HeaderCharts name='Indicadores Financieros' />, document.getElementById('header-charts'));
render(<FinancialCharts data={[]} />, document.getElementById('charts'));
