import types from '../Constants/action-types'
import axios from 'axios'

export function sensorData(data) {
    return {
        type: types.SENSORDATA,
        payload: data
    }
}

export function minMaxValues(value) {
    return {
        type: types.MINMAXDATA,
        payload: value
    }
}


export function getSensorData(startDate,endDate) {
    return (dispatch) => {
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get(`http://localhost:8000/sensors/?timestamp__gte=${startDate}&timestamp__lte=${endDate}`, options)
            .then(res => {
                dispatch(sensorData(res.data))
            })
            .catch(err => {
                
                console.error("Error", err)
            })
    }
}

export function getMinMaxValues(startDate,endDate) {
    return (dispatch) => {
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get(`http://localhost:8000/values/?timestamp__gte=${startDate}&timestamp__lte=${endDate}`, options)
            .then(res => {
                dispatch(minMaxValues(res.data))
            })
            .catch(err => {
                
                console.error("Error", err)
            })
    }
}


