import axios from "axios"


const getFlightsDetailsApi = 'http://localhost:8080/api/flights/by-owner'

export const displayFlights = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(getFlightsDetailsApi,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        dispatch({
            type: 'GET_FLIGHTS',
            payload: response.data
        })
    }
    catch (err) {
        console.log("Error is: ", err)
    }

}