import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';

const ModalChart = ({data}) => {
    const config = {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Valor del Stock ' + name
        },
        series: [{
            name: data[0].name,
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

    const hide = () => {
        document.getElementById('historical').style.display = 'none';
    }

    return (
        <div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>{data[0].name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactHighstock config={config} />,
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
