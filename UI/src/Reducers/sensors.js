import types from '../Constants/action-types';


export function SensorData(state = [], action) {
    switch (action.type) {
        case types.SENSORDATA:
            return action.payload;
        default:
            return state;
    }
}

export function MinMaxData(state={},action){
    switch(action.type){
        case types.MINMAXDATA:
            return action.payload;
        default:
            return state;
    }
}