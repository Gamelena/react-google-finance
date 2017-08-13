import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import SimpleLineChart from './components/SimpleLineChart';

render(<App name='World' />, document.getElementById('root'));
render(<SimpleLineChart />, document.getElementById('container'));
