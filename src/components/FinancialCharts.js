import React from 'react';
import ReactDOM from 'react-dom';
import ModalChart from './ModalChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import IO from 'socket.io-client';
import PropTypes from 'prop-types';
const socket = IO({ path: '/socket.io' });


socket.emit('req-stocks', {stocks: 'AAPL,ABC,MSFT,TSLA,F'});

socket.on('fetch-stocks', data => {
    ReactDOM.render(<FinancialCharts data={data}/>, document.getElementById('charts'));
});

socket.on('fetch-historical', data => {
    console.log('fetch-historical', data);
    document.getElementById('historical').style.display = 'block';
    ReactDOM.render(<ModalChart data={data}/>, document.getElementById('historical'));
});

const FinancialCharts = ({data}) => {
    const handleClick = item => {
        console.log(item);
        socket.emit('req-historical', {stock: item.ticker});
    }

    return (
      <BarChart
        width={800} height={600} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip onClick={(item)=> handleClick(item)} />
        <Legend />
        <Bar type="monotone" dataKey="valor" onClick={(e)=> handleClick(e)} fill="#8884d8" />
      </BarChart>
    );
};

FinancialCharts.propTypes = {
    data: PropTypes.array,
};

export default FinancialCharts;


