import { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { connect } from 'react-redux'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community';
import { getSensorData, getMinMaxValues } from '../../Actions/sensors'
import './Home.css';
import { Line } from 'react-chartjs-2';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            limit: 20,
            offset: 0,
            startDate: new Date(),
            endDate: new Date(),
            minMaxData: {},
            columnDefs: [

                {
                    headerName: "Id", field: "id", sortable: true, filter: true, resizable: true, suppressMovable: true, width: 200
                },
                {
                    headerName: "Reading", field: "reading", sortable: true, resizable: true, suppressMovable: true, filter: true, width: 300
                },
                {
                    headerName: "Timestamp", field: "timestamp", sortable: true, filter: true, resizable: true, suppressMovable: true, width: 300, cellRenderer: function (params) {
                        return moment.unix(params.data.timestamp).format("MM-DD-YY")
                    }
                },
                {
                    headerName: "Sensor Type", field: "sensorType", sortable: true, filter: true, resizable: true, suppressMovable: true, width: 300
                }
            ],
            rowData: [

            ],
            paginationPageSize: 10,

        }
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.setDomLayout("autoHeight");

    }

    handleStartDateChange(date) {

        var epoch = moment(date.toDateString()).unix();
        console.log(epoch)
        this.setState({
            startDate: date
        })
    }

    handleEndDateChange(date) {
        var epoch = moment(date.toDateString()).unix();
        console.log(epoch)
        this.setState({
            endDate: date
        }, () => {
            let startTimestamp = moment(this.state.startDate.toDateString()).unix()
            let endTimestamp = moment(this.state.endDate.toDateString()).unix()
            console.log(startTimestamp, endTimestamp)
            if (this.state.endDate > this.state.startDate) {
                this.props.getSensorData(startTimestamp, endTimestamp)
                this.props.getMinMaxValues(startTimestamp, endTimestamp)
            }
        })

    }
    getPropertyValues = (prop, arr) => {
        let result = []
        if (arr.length > 0) {
            arr.forEach(element => {
                result.push(element[prop])
            });
            return result
        }
    }
    render() {
        const { startDate, endDate, minMaxData } = this.state
        const data = {
            labels: this.getPropertyValues("timestamp", this.state.rowData),
            datasets: [
                {
                    data: this.getPropertyValues("reading", this.state.rowData),
                    label: "reading",
                    borderColor: "#3e95cd",
                    fill: false,

                },

            ],


        }
        const options = {

            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    }
                }]
            }
        }
        return (
            <>
                <h6 style={{ padding: "10px", textAlign: "center" }}>Please select a valid date range to view data</h6>
                <div className="datepicker-container">
                    <div>Start Date: <DatePicker selected={this.state.startDate} onChange={date => this.handleStartDateChange(date)} /></div>
                    <div>End Date: <DatePicker selected={this.state.endDate} onChange={date => this.handleEndDateChange(date)} /></div>
                </div>
                {startDate > endDate ? <span style={{ color: "red", paddingLeft: "2em" }}>Please select a valid date range</span> : null}

                {minMaxData["min"] ? <div className="min-max-container">
                    <span className="value-text">Min Value: {minMaxData["min"].reading__min}</span>
                    <span className="value-text">Max Value: {minMaxData["max"].reading__max}</span>
                    <span className="value-text">Mean Value: {minMaxData["mean"].reading__avg}</span>
                </div> : null}
                {
                    this.state.rowData.length > 0 ?
                        <>
                            <div className="shadow p-3 mb-5 bg-white rounded" style={{ margin: "2%" }}>
                                <div className="card table-card">
                                    <div className="card-body">
                                        <div className="" style={{ padding: "0px", marginBottom: "0px", height: "100%", width: "100%" }}>


                                            <>
                                                <div className="ag-theme-material home-ag" id="main">
                                                    <div className="shadowHome p-3  bg-white rounded" style={{ marginBottom: "0px" }}>
                                                        <AgGridReact
                                                            onGridReady={this.onGridReady}
                                                            columnDefs={this.state.columnDefs}
                                                            rowData={this.state.rowData}
                                                            pagination={true}
                                                            reactNext={true}
                                                            suppressMenuHide={true}
                                                            animateRows
                                                            paginationPageSize={this.state.paginationPageSize}
                                                            width="400"
                                                        >
                                                        </AgGridReact>
                                                    </div>

                                                </div>
                                            </>

                                        </div>

                                    </div></div></div>

                            <div className="shadow p-3 mb-5 bg-white rounded" style={{ margin: "2%" }}>
                                <div className="card table-card">
                                    <div className="card-body">
                                        <div className="" style={{ padding: "0px", marginBottom: "0px", height: "100%", width: "100%" }}>
                                            <Line data={data} options={options} />


                                        </div></div></div></div>
                        </>
                        : null}
            </>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rowData: nextProps.sensorData,
            minMaxData: nextProps.minMaxData
        })
    }
}
const mapStateToProps = (state) => {
    return {
        sensorData: state.SensorData,
        minMaxData: state.MinMaxData
    }
}

const mapDispatchToProps = {
    getSensorData,
    getMinMaxValues
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

