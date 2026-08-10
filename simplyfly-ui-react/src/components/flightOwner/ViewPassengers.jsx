import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displayFlights } from "../../action/DisplayFlightAction";
import axios from "axios";

function ViewPassengers() {

    const [dispFlights, setDispFlights] = useState([])
    const [count, setCount] = useState(0)
    const [passengers, setPassengers] = useState([]);
    const [flightNum, setFlightNum] = useState('')
    const [search, setSearch] = useState([...dispFlights])
    const dispatch = useDispatch()

    const token = localStorage.getItem('token')


    const getPassengersApi = 'http://localhost:8080/api/flights/get-passengers/byFlight/'

    const Flight_List = useSelector(state => state.flightSlice.flightList)

    useEffect(() => { // from backend
        dispatch(displayFlights())
    }, [dispatch, count])

    useEffect(() => { // manages local component
        setDispFlights(Flight_List)
        setSearch(Flight_List)
    }, [Flight_List])


    const fetchPassengers = async (flightId, flightNumber) => {
        try {
            const response = await axios.get(`${getPassengersApi}${flightId}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            )
            setPassengers(response.data)
            setFlightNum(flightNumber)

        }
        catch (err) {
            console.log("Error is ", err)
        }

    }
    const filterFlights = (searchStr) => {
        if (!searchStr) {
            setSearch(dispFlights)
            return
        }

        const regex = new RegExp(searchStr.replace(/%/g, '.*').replace(/_/g, '.'), 'i');

        setSearch([...dispFlights.filter(df => df.flightNumber.match(regex))])

    }

    return (
        <div className="container-fluid px-5 mt-5">
            <div className="mb-3" style={{ maxWidth: '400px' }}>
                <input type="text" className="form-control border-3" placeholder={"🔍 Search by Flight Number"} onChange={(e) => {
                    filterFlights(e.target.value)
                }} />
            </div>

            <div className="mb-5 table-responsive border rounded-3 shadow-sm" style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                <table className=" table table-hover align-middle mb-0" style={{ fontSize: '15px' }}>
                    <thead>
                        <tr>
                            <th className="ps-4 py-4 fw-semibold" style={{ width: '60px', backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>#</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Flight ID</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Flight Number</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Company</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Origin</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Destination</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Departure Date & Time</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Arrival Date & Time</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Status</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Economy Price</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Business Price</th>
                            <th className="py-4 fw-semibold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Available Seats</th>
                            <th className="pe-4 py-4 text-end fw-semibold" style={{ width: '120px', backgroundColor: '#1e3a8a', color: '#ffffff', borderBottom: 'none' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            search.map((df, index) => {
                                const isLowSeats = df.availableSeats < 10;
                                return (
                                    <tr key={index}>
                                        <td className="ps-4 text-secondary">{index + 1}</td>
                                        <td className="fw-medium text-dark">{df.flightId}</td>
                                        <td>
                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1.5 fw-semibold">
                                                {df.flightNumber}
                                            </span>
                                        </td>
                                        <td className="fw-medium text-dark">{df.company}</td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
                                                {df.origin}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                                {df.destination}
                                            </span>
                                        </td>
                                        <td className="text-secondary">{df.departureTime.split('T')[0]} {df.departureTime.split('T')[1]}</td>
                                        <td className="text-secondary">{df.arrivalTime.split('T')[0]} {df.arrivalTime.split('T')[1]}</td>
                                        <td>
                                            <span className={`badge px-2 py-1 border ${df.status === 'CANCELLED'
                                                ? 'bg-danger-subtle text-danger border-danger-subtle'
                                                : 'bg-success-subtle text-success border-success-subtle'
                                                }`}>
                                                {df.status}
                                            </span>
                                        </td>
                                        <td className="fw-semibold text-success">
                                            ₹{df.basePrice.toLocaleString('en-IN')}
                                        </td>
                                        <td className="fw-semibold" style={{ color: '#4f46e5' }}>
                                            ₹{Math.round(df.basePrice * 3.18).toLocaleString('en-IN')}
                                        </td>
                                        <td className={`fw-semibold text-center ${isLowSeats ? 'text-danger' : 'text-dark'}`}>
                                            {df.availableSeats} {isLowSeats && <small style={{ fontSize: '10px' }}>(Low)</small>}
                                        </td>
                                        <td className="pe-3 py-3 text-center ">
                                            <div className="d-flex align-items-center justify-content-center gap-1">
                                                <button className="btn btn-success"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#viewPassengersModal"
                                                    onClick={() => fetchPassengers(df.flightId, df.flightNumber)}>View passengers</button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>

                {/* View pasengers modal */}
                <div className="modal fade" id="viewPassengersModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-xl"> {/* modal-xl for a nice wide table */}
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">
                                    Flight Passenger List :
                                    <span className="text-warning text-uppercase font-monospace ms-2 bg-white bg-opacity-10 px-2 py-0.5 rounded">
                                        {flightNum}
                                    </span>
                                </h5>

                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div className="modal-body bg-light">

                                <div className="text-center py-5">


                                </div>{
                                    (passengers.length === 0 ? (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No passengers have booked this flight yet.</h5>
                                        </div>
                                    ) : (
                                        <div className="table-responsive bg-white rounded shadow-sm border">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="ps-3 py-3">Name</th>
                                                        <th className="py-3">Age</th>
                                                        <th className="py-3">Gender</th>
                                                        <th className="py-3">Seat</th>
                                                        <th className="py-3">Class</th>
                                                        <th className="py-3">e-Ticket</th>
                                                        <th className="py-3">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {passengers.map((p, idx) => (
                                                        <tr key={idx} className={p.passengerStatus === 'CANCELLED' ? 'text-muted' : ''}>
                                                            <td className="ps-3 fw-semibold">{p.passengerName}</td>
                                                            <td>{p.age}</td>
                                                            <td>{p.gender}</td>
                                                            <td className="fw-bold text-primary">{p.seatNumber}</td>
                                                            <td>
                                                                <span className="badge bg-secondary">{p.seatClass}</span>
                                                            </td>
                                                            <td>
                                                                <small>{p.eTicketNumber}</small>
                                                            </td>
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
                                    ))}
                            </div>

                            <div className="modal-footer bg-white">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewPassengers