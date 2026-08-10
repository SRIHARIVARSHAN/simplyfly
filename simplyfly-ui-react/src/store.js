import { configureStore } from "@reduxjs/toolkit";
import { DisplayFlightReducer } from "./reducer/DisplayFlightReducer";

export default configureStore({
    reducer:{
        flightSlice:DisplayFlightReducer
    }
})