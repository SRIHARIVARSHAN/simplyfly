import { Outlet } from "react-router"
import NavBar from "./NavBar"
import SearchFlight from "./SearchFlight"
import ViewBookings from "./ViewBookings"

function CustomerHome(){
    return(
        <div>
            <NavBar />
            <SearchFlight />
            <Outlet />
        </div>
    )
}

export default CustomerHome