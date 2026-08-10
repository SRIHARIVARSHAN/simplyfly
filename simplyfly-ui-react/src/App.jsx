import { useState } from 'react'

import CustomerHome from './components/CustomerHome'
import { Route, Routes } from "react-router"
import PageNotFound from './components/PageNotFound'
import SearchFlight from './components/SearchFlight'
import Login from './components/auth/Login'
import AdminDashBoard from './components/admin/AdminDashBoard'
import Book from './components/Book'
import FlightOwnerDashboard from './components/flightOwner/FlightOwnerDashboard'
import AdminViewUsers from './components/admin/AdminViewUsers'
import ViewBookings from './components/ViewBookings'
import ManageFlight from './components/flightOwner/ManageFlight'
import ViewPassengers from './components/flightOwner/ViewPassengers'
import SignUp from './components/auth/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<CustomerHome />}>
          <Route path="/search" element={<SearchFlight />} />
        </Route>
        
        <Route path='/view-bookings' element={<ViewBookings />} />
        <Route path="book" element={<Book />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="admin" element={<AdminDashBoard />}>
          <Route path="search" element={<SearchFlight />}/>
          <Route path="view-users" element={<AdminViewUsers />} />
        </Route>
        <Route path="flightOwner" element={<FlightOwnerDashboard />}>
          <Route path="search" element={<SearchFlight />} />
          <Route path='manage-flight' element={<ManageFlight />} />
          <Route path='view-passengers' element={<ViewPassengers />}/>
        </Route>
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App
