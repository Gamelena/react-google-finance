import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import PropTypes from 'prop-types';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ModalChart = ({data}) => {
    const hide = () => {
        document.getElementById('historical').style.display = 'none';
    }
    return (
        <div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>{data.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LineChart
                        width={600} height={400} data={data}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip onClick={(e) => handleClick(e)}/>
                        <Legend/>
                        <Line type="monotone" dataKey="valor" onClick={(e) => handleClick(e)} fill="#8884d8"/>
                    </LineChart>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => hide()}>Close</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
};

ModalChart.propTypes = {
    data: PropTypes.array
};

export default ModalChart;
