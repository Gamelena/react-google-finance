import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import IO from 'socket.io-client';
import PropTypes from 'prop-types';
const socket = IO();

let data = [
    { name: 'Page A', price: 4000.67},
    { name: 'Page B', price: 3000.78},
    { name: 'Page C', price: 2000.09},
    { name: 'Page D', price: 2780},
    { name: 'Page E', price: 1890},
    { name: 'Page F', price: 2390},
    { name: 'Page G', price: 3490},
];

socket.emit('indicator', {indicator: 'AAPL,ABC,MSFT,TSLA,F'});

socket.on('fetch-indicators', rawData => {
    data = JSON.parse(rawData);
    ReactDOM.render(<FinancialCharts data={data}/>, document.getElementById('charts'));
});


const FinancialCharts = ({data}) => {
    return (
      <LineChart
        width={600} height={300} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    );
};

FinancialCharts.propTypes = {
    data: PropTypes.array,
};

export default FinancialCharts;


