import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import AdminNavbar from "./AdminNavbar"
import SearchFlight from "../SearchFlight"

function AdminDashBoard(){
    const navigate=useNavigate()

    useEffect(()=>{
        const verifyAuth=async()=>{
            const token=localStorage.getItem('token')
        }

    },[])
    return (
        <div>
        <AdminNavbar />
        <Outlet />
        </div>
        )
    }

export default AdminDashBoard