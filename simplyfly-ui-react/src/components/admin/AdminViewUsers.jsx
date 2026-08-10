import axios from "axios"
import { useEffect, useState } from "react"

function AdminViewUsers() {
    const [role, setRole] = useState('')
    const [disrole, setDisRole] = useState('')//for diabled tab
    const [users, setUsers] = useState([])
    const [disUsers, setDisUsers] = useState([])//for disabled tab
    const [showSearch, setShowSearch] = useState(false);
    const [usersearch, setUserSearch] = useState([...users])
    const [disabledUsersearch, setDisabledUserSearch] = useState([...disUsers])//for diabled tab
    const [clicked, setClicked] = useState(false)

    const [count, setCount] = useState(0);
    const [disableCount, setDisableCount] = useState(0);
    const [activeTab, setActiveTab] = useState('ACTIVE');
    const hasCompanyData = usersearch.some(u => u.companyName);
    const [userBookings, setUserBookings] = useState([]);
    const [flightDetails, setFlightDetails] = useState([])

    const userRole = localStorage.getItem('role')
    const getUserByRoleApi = "http://localhost:8080/api/user/getByRole?role="
    const getDisabledUserApi = "http://localhost:8080/api/user/get-disableduser?role=" //for disabled tab
    const getUserBookingsApi = "http://localhost:8080/api/admin/user/booking-details/"
    const getFlightDetailsApi = "http://localhost:8080/api/admin/flight-details/"
    useEffect(() => {
        const getUserByRole = async () => {
            try {
                const resp = await axios.get(`${getUserByRoleApi}${role}`)
                console.log(resp.data)
                setUsers(resp.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        getUserByRole()
    }, [role, count])

    useEffect(() => {
        const getDisabledUser = async () => {
            try {
                const disabledresp = await axios.get(`${getDisabledUserApi}${disrole}`)
                console.log(disabledresp.data)
                setDisUsers(disabledresp.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        getDisabledUser()
    }, [disrole, disableCount])

    useEffect(() => {
        setUserSearch(users)
                setDisabledUserSearch(disUsers)

    }, [users,disUsers])
    // useEffect(() => {
    //     setDisabledUserSearch(disUsers)
    // }, [])



    const filterOp = (filVal) => {
        switch (filVal) {
            case 'PASSENGER':
                setRole('PASSENGER')
                setDisRole('PASSENGER')
                break
            case 'FLIGHT_OWNER':
                setRole('FLIGHT_OWNER')
                setDisRole("FLIGHT_OWNER")
                break;
        }

    }
    const filterUsers = (searchStr) => {
        if (!searchStr) {
            setUserSearch(users);
            setDisabledUserSearch(disUsers)
            return;
        }
        console.log(usersearch)

        const regex = new RegExp(searchStr.replace(/%/g, '.*').replace(/_/g, '.'), 'i');

        if (role === 'PASSENGER') {
            setUserSearch([...users.filter(u => u.name && u.name.match(regex)) || (u.email && u.email.match(regex))])
            setDisabledUserSearch([...disUsers.filter(du => du.name && du.name.match(regex) || du.email && du.email.match(regex))])
        }
        else {
            setUserSearch([...users.filter(u => u.companyName.match(regex))])
            setDisabledUserSearch([...disUsers.filter(du => du.companyName.match(regex))])

        }
    }

    const toDisableUser = (userId, userName, userRole) => {
        Swal.fire({

            title: "Are you Sure?",
            text: `Do you really want to disable the ${userRole === 'FLIGHT_OWNER' ? "Flight Owner" : "Passenger"} ${userName}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",     
            cancelButtonText: "No",        
            confirmButtonColor: "#3085d6", 
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const delResponse = await axios.delete(`http://localhost:8080/api/user/delete/${userId}`)
                    Swal.fire("Disabled!", "The user has been successfully disabled.", "success");
                    setCount(count + 1)
                }
                catch (err) {
                    console.error("API Error:", err);
                }
            }

        })
    }
    //disbale to enable
    const toEnableUser = (disUserId, disUserName, disUserRole) => {
        Swal.fire({

            title: "Are you Sure?",
            text: `Do you really want to enable the ${disUserRole === 'FLIGHT_OWNER' ? "Flight Owner" : "Passenger"} ${disUserName}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const enableResponse = await axios.patch(`http://localhost:8080/api/user/enable/${disUserId}`)
                    Swal.fire("Enabled!", "The user has been successfully enabled.", "success");
                    setDisableCount(count + 1)
                }
                catch (err) {
                    console.error("API Error:", err);
                }
            }

        })
    }

    const fetchUserBookings = async (email) => {
        try {
            const resp = await axios.get(`${getUserBookingsApi}${email}`)
            console.log(resp.data)
            setUserBookings(resp.data)
        }
        catch (err) {
            console.log("Error is: ", err)
        }
    }

    const fetchFlightDetails = async (email) => {
        console.log("in flight owner")
        try {
            const resp = await axios.get(`${getFlightDetailsApi}${email}`)
            console.log(`${getFlightDetailsApi}${email}`)
            console.log(resp.data)
            setFlightDetails(resp.data)
        }
        catch (err) {
            console.log("Error is: ", err)
        }
    }

    return (
        <div className="container py">
            {userRole === 'ADMIN' ? (
                <>
                    {/* View Options / Controls Section */}
                    <div className="row mt-4 mb-4">
                        <div className="col-lg-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light p-0 border-0">
                                    <ul className="nav nav-tabs border-0">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link fw-semibold px-4 py-3 border-0 rounded-0 ${activeTab === 'ACTIVE' ? 'active text-primary bg-white fw-bold' : 'text-secondary bg-transparent'}`}
                                                onClick={() => setActiveTab('ACTIVE')}
                                            >
                                                🟢 Active Accounts
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link fw-semibold px-4 py-3 border-0 rounded-0 ${activeTab === 'DISABLED' ? 'active text-danger bg-white fw-bold' : 'text-secondary bg-transparent'}`}
                                                onClick={() => setActiveTab('DISABLED')}
                                            >
                                                🔴 Disabled Accounts
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body p-4 bg-white rounded-bottom">
                                    <h5 className="card-title mb-3 fw-semibold text-dark">
                                        View {activeTab === 'ACTIVE' ? 'Active' : 'Disabled'} Users
                                    </h5>
                                    <div className="d-flex gap-4 align-items-center mb-3">
                                        <label className="d-flex align-items-center gap-2 cursor-pointer">
                                            <input type="radio" name="role" className="form-check-input" onClick={() => { setShowSearch(true); filterOp("PASSENGER"); setClicked(true) }} />
                                            <span>Passengers</span>
                                        </label>
                                        <label className="d-flex align-items-center gap-2 cursor-pointer">
                                            <input type="radio" name="role" className="form-check-input" onClick={() => { setShowSearch(true); filterOp("FLIGHT_OWNER"); setClicked(true) }} />
                                            <span>Flight Owners</span>
                                        </label>
                                    </div>
                                    {showSearch && (
                                        <div className="mb-3" style={{ maxWidth: '400px' }}>
                                            <input type="text" className="form-control" placeholder={role === "PASSENGER" ? "🔍 Search by Name or Email..." : "🔍 Search By Airlines..."} onChange={(e) => {
                                                filterUsers(e.target.value)
                                            }} />
                                        </div>
                                    )}

                                    <button className="btn btn-outline-secondary btn-sm px-4" onClick={() => { setShowSearch(false); filterOp(''); }}>
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* View booking history modal */}
                    <div className="modal fade" id="viewBookingHistoryModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">

                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title fw-bold">User Booking History</h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body bg-light">

                                    {userBookings.length === 0 ? (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No bookings found for this user.</h5>
                                        </div>
                                    ) : (
                                        // 1st Loop: Loop through the Bookings
                                        userBookings.map((booking, index) => (
                                            <div key={index} className="card shadow-sm border-0 mb-4">

                                                {/* Booking Info Header */}
                                                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-0 text-primary">Flight: {booking.flightNumber}</h6>
                                                        <small className="text-muted">{booking.origin} to {booking.destination} on {new Date(booking.departureTime.split('T')[0]).toLocaleDateString()} &nbsp; {(booking.departureTime.split('T')[1].split('.')[0])}</small> <br />
                                                        <small className="text-muted fw-bold">Booking ID: {booking.bookingId} </small> <br />
                                                        <small className="text-muted ">Booked on: {new Date(booking.bookingDate.split('T')[0]).toLocaleDateString()} &nbsp; {booking.bookingDate.split('T')[1].split('.')[0]} </small>

                                                    </div>
                                                    <div>
                                                        <span className={`badge ${booking.bookingStatus === "CONFIRMED" ? "bg-success me-2" : "bg-danger"}`}>{booking.bookingStatus}</span>
                                                        <span className="fw-bold"> Paid: ₹{booking.totalAmount.toLocaleString()}</span> <br />
                                                        <small className="fw-"> Transaction ({booking.paymentMethod === "CREDIT_CARD" ? "CREDIT CARD" : "UPI"})</small> &nbsp;
                                                        {(booking.passengers.some(p => p.passengerStatus !== 'ACTIVE')) ?
                                                            <span className="badge border border-success text-primary bg-white">Refunded Amount: ₹{(booking.refundedAmount.toLocaleString())}</span>
                                                            : ""}
                                                    </div>
                                                </div>

                                                {/* 2nd Loop: Passenger Table inside the Booking */}
                                                <div className="card-body p-0">
                                                    <div className="table-responsive">
                                                        <table className="table table-hover align-middle mb-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th className="ps-3 py-2">Passenger Id</th>
                                                                    <th className="ps-3 py-2">Passenger Name</th>
                                                                    <th className="py-2">Age/Gender</th>
                                                                    <th className="py-2">Seat</th>
                                                                    <th className="py-2">Class</th>
                                                                    <th className="py-2">e-Ticket</th>
                                                                    <th className="py-2">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {booking.passengers.map((p, idx) => (
                                                                    <tr key={idx} className={p.passengerStatus === 'CANCELLED' ? 'text-muted text-decoration-line-through' : ''}>
                                                                        <td className="ps-3 fw-semibold">{p.passengerId}</td>
                                                                        <td className="ps-3 fw-semibold">{p.passengerName}</td>
                                                                        <td>{p.age} / {p.gender}</td>
                                                                        <td className="fw-bold text-primary">{p.seatNumber}</td>
                                                                        <td><span className="badge bg-secondary">{p.seatClass}</span></td>
                                                                        <td><small>{p.eTicketNumber}</small></td>
                                                                        <td>
                                                                            <span className={`badge ${p.passengerStatus === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                                                                                {p.passengerStatus}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="modal-footer bg-white">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* View Flight Details modal */}
                    <div className="modal fade" id="viewFlightDetailsModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">

                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title fw-bold">Flight Details </h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body bg-light">
                                    {flightDetails.length === 0 ? (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No flight details found.</h5>
                                        </div>
                                    ) : (
                                        <div className="table-responsive bg-white p-3 rounded shadow-sm">
                                            <table className="table table-hover table-striped align-middle mb-0">
                                                <thead className="table-success">
                                                    <tr>
                                                        <th scope="col">Flight ID</th>
                                                        <th scope="col">Flight No</th>
                                                        <th scope="col">Airline</th>
                                                        <th scope="col">Route</th>
                                                        <th scope="col">Departure</th>
                                                        <th scope="col">Arrival</th>
                                                        <th scope="col">Price (INR)</th>
                                                        <th scope="col">Seats Left</th>
                                                        <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {flightDetails.map((flight, index) => (
                                                        <tr key={index}>
                                                            <td>{flight.flightId}</td>
                                                            <td className="fw-bold text-primary">{flight.flightNumber}</td>
                                                            <td>{flight.company}</td>
                                                            <td>
                                                                <span className="fw-semibold">{flight.origin}</span>
                                                                <i className="bi bi-arrow-right mx-2 text-muted"></i>
                                                                <span className="fw-semibold">{flight.destination}</span>
                                                            </td>
                                                            <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                                            <td className="fw-bold">₹{flight.basePrice.toLocaleString()}</td>
                                                            <td>
                                                                <span className={`badge ${flight.availableSeats > 10 ? 'bg-success' : 'bg-danger'}`}>
                                                                    {flight.availableSeats}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${flight.status !== "CANCELLED" ? "bg-info text-dark" : "bg-danger"}`} >{flight.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer bg-white">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active tab table */}
                    {activeTab === 'ACTIVE' ? (<div className="row">
                        <div className="col-lg-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-0"> {/* p-0 fits table flush against the card borders */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4 py-3" style={{ width: '100px' }}>#</th>
                                                    <th className="ps-4 py-3" style={{ width: '100px' }}>User ID</th>
                                                    <th className="py-3">Name</th>
                                                    <th className="py-3">Email</th>
                                                    <th className="py-3">Role</th>
                                                    {hasCompanyData && <th className="py-3">Airline</th>}
                                                    <th className="pe-4 py-3 text-end" style={{ width: '150px' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersearch.length > 0 ? (
                                                    usersearch.map((u, index) => (
                                                        <tr key={index}>
                                                            <td className="ps-4 fw-medium text-secondary">{index + 1}</td>
                                                            <td className="ps-4 fw-medium text-secondary">{u.id}</td>
                                                            <td className="fw-semibold text-dark">{u.name}</td>
                                                            <td>{u.email}</td>
                                                            <td>
                                                                {u.role === "FLIGHT_OWNER" ? (
                                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded">
                                                                        Flight Owner
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2.5 py-1.5 rounded">
                                                                        Passenger
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {u.companyName && (
                                                                <td>
                                                                    <span className="text-dark fw-medium">{u.companyName}</span>
                                                                </td>
                                                            )}
                                                            <td className="pe-4 text-end">
                                                                <div className="d-inline-flex gap-2 align-items-center">
                                                                    {/*  View Details */}
                                                                    <button
                                                                        className="btn btn-outline-primary btn-sm border-0 p-1 lh-1"
                                                                        title="View Flight Details"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={role === "PASSENGER" ? "#viewBookingHistoryModal" : "#viewFlightDetailsModal"}
                                                                        onClick={(e) => { (role === "PASSENGER") ? fetchUserBookings(u.email) : fetchFlightDetails(u.email) }}
                                                                    >
                                                                        <i className="bi bi-eye fs-4"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger btn-sm px-3 shadow-sm"
                                                                        onClick={() => toDisableUser(u.id, u.name, u.role)}
                                                                    >
                                                                        Disable
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-5 text-muted">
                                                            <div className="py-3">
                                                                {clicked ? (
                                                                    <p className="mb-0 fw-medium">No records found matching your selection.</p>
                                                                ) : (
                                                                    <p className="mb-0 fw-medium">Please select user type.</p>
                                                                )
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>) :
                        //Disabled tab table
                        (<div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-0"> {/* p-0 fits table flush against the card borders */}
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="ps-4 py-3" style={{ width: '100px' }}>#</th>
                                                        <th className="ps-4 py-3" style={{ width: '100px' }}> User ID</th>
                                                        <th className="py-3">Name</th>
                                                        <th className="py-3">Email</th>
                                                        <th className="py-3">Role</th>
                                                        {hasCompanyData && <th className="py-3">Airline</th>}
                                                        <th className="pe-4 py-3 text-end" style={{ width: '150px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {disabledUsersearch.length > 0 ? (
                                                        disabledUsersearch.map((du, index) => (
                                                            <tr key={index}>
                                                                <td className="ps-4 fw-medium text-secondary">{index + 1}</td>
                                                                <td className="ps-4 fw-medium text-secondary">{du.id}</td>
                                                                <td className="fw-semibold text-dark">{du.name}</td>
                                                                <td>{du.email}</td>
                                                                <td>
                                                                    {du.role === "FLIGHT_OWNER" ? (
                                                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded">
                                                                            Flight Owner
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2.5 py-1.5 rounded">
                                                                            Passenger
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                {du.companyName && (
                                                                    <td>
                                                                        <span className="text-dark fw-medium">{du.companyName}</span>
                                                                    </td>
                                                                )}
                                                                <td className="pe-4 text-end">
                                                                    <div className="d-inline-flex gap-2 align-items-center">
                                                                        {/*  View Details */}
                                                                        {(role === "PASSENGER" ? (
                                                                            <button
                                                                                className="btn btn-outline-primary btn-sm border-0 p-1 lh-1"
                                                                                title="View Bookings"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target={role === "PASSENGER" ? "#viewBookingHistoryModal" : "#viewFlightDetailsModal"}
                                                                                onClick={(e) => { (role === "PASSENGER") ? fetchUserBookings(du.email) : null }}
                                                                            >
                                                                                <i className="bi bi-eye fs-4"></i>
                                                                            </button>) : "")}
                                                                        <button
                                                                            className="btn btn-success btn-sm px-3 shadow-sm"
                                                                            onClick={() => toEnableUser(du.id, du.name, du.role)}
                                                                        >
                                                                            Enable
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                                <div className="py-3">
{clicked ? (
                                                                    <p className="mb-0 fw-medium">No records found matching your selection.</p>
                                                                ) : (
                                                                    <p className="mb-0 fw-medium">Please select user type.</p>
                                                                )
                                                                }                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }
                </>
            ) : null}
        </div>

    )
}

export default AdminViewUsers