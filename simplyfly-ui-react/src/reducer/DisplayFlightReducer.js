const initialState={
    flightList:[]
}


export const DisplayFlightReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'GET_FLIGHTS':
            return{
                ...state,
                flightList:action.payload
            }
        default:
            return state;
    }

}