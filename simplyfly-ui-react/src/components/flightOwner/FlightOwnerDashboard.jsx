import { Outlet } from "react-router"
import FlightOwnerNavbar from "./FlightOwnerNavbar"
import { useEffect } from "react"
import SearchFlight from "../SearchFlight"

function FlightOwnerDashboard() {
    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token')
        }
    }, [])
    return (
        <div>
            <FlightOwnerNavbar />
            <Outlet />

        </div>
    )
}
export default FlightOwnerDashboard