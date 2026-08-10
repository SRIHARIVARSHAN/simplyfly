import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { displayFlights } from "../../action/DisplayFlightAction"

function ManageFlight() {
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [dispFlights, setDispFlights] = useState([])
    const [count, setCount] = useState(0)
    const [search, setSearch] = useState([...dispFlights])
    const dispatch = useDispatch()

    const Flight_List = useSelector(state=>state.flightSlice.flightList)

    //modal input states
    const [flightNumber, setFlightNumber] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [basePrice, setBasePrice] = useState('');

    //for view seat
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [currentFlightId, setCurrentFlightId] = useState(null);
    const [editFlight, setEditFlight] = useState({
        flightId: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        basePrice: ''
    });

    const getFlightsDetailsApi = 'http://localhost:8080/api/flights/by-owner'
    const addFlightDetailsApi = 'http://localhost:8080/api/flights/add-Details'
    const fetchSeatsApi = 'http://localhost:8080/api/seats/flight/'
    const lockSeatsApi = 'http://localhost:8080/api/flights/seat/lock-seat/'
    const unlockSeatsApi = 'http://localhost:8080/api/flights/seat/enable-seat/'
    const editFlightDetailsApi = 'http://localhost:8080/api/flights/update/'
    const cancelFlightApi = 'http://localhost:8080/api/flights/cancel/'
    // useEffect(() => {
    //     const getFlightsDetails = async () => {
            
    //     }
    //     getFlightsDetails()
    // }, [count])

    useEffect(()=>{ // from backend
        dispatch(displayFlights())
    },[count])

    useEffect(()=>{ // manages local component
        setDispFlights(Flight_List)
                setSearch(Flight_List)

    },[Flight_List])

    const onadd = async (e) => {
        e.preventDefault()
        const newFlightData = {
            flightNumber: flightNumber,
            origin: origin,
            destination: destination,
            departureTime: departureTime ? `${departureTime}:00` : "",
            arrivalTime: arrivalTime ? `${arrivalTime}:00` : "",
            basePrice: parseFloat(basePrice) //text to number 
        };
        Swal.fire({

            title: "Check",
            text: `Before Adding the flight check the details properly once again`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Checked",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            try {
                const flightAddResp = await axios.post(addFlightDetailsApi, newFlightData,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    }
                )
                setCount(count + 1)
                console.log(flightAddResp.data)
                swal.fire('Added!', 'Your flight has been added successfully', 'success')
                document.getElementById('closeAddModalBtn').click();

            }
            catch (err) {
                console.log("Error is: ", err)

            }

        })


        console.log("FLigt: ", newFlightData)
    }

    const handleEditChange = (e) => {
        setEditFlight({ ...editFlight, [e.target.name]: e.target.value });
    };
    const onEditSubmit = (e) => {
        e.preventDefault()
        console.log(e)
        Swal.fire({

            title: "Warning!",
            text: `Please check the Flight details carefully before updating it`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Checked",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            try {
                const editResp = await axios.put(`${editFlightDetailsApi}${editFlight.flightId}`, editFlight,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    }
                )
                Swal.fire("Updated!", `The Flight details have been updated successfully`, "success");
                setCount(count + 1)
                document.getElementById('closeEditModalBtn').click();

            }
            catch (err) {
                console.log(err)
            }

        })


    }



    const fetchSeats = async (flightId) => {
        setCurrentFlightId(flightId);
        //setLoadingSeats(true);
        setSelectedSeats([]);

        try {
            const resp = await axios.get(`${fetchSeatsApi}${flightId}`)
            console.log(resp.data)
            setSeats(resp.data)
        } catch (error) {
            console.error("Error fetching seats:", error);
        }
    };

    // seats to rows
    const groupSeatsByRow = () => {
        const rows = {};
        console.log(seats)
        seats.forEach(seat => {
            console.log(seat)
            const rowNum = seat.seatNumber.match(/\d+/)[0];
            if (!rows[rowNum]) {
                rows[rowNum] = []
            }
            rows[rowNum].push(seat);
        });
        console.log(rows)
        return rows;
    };

    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber)); // Deselect
        }
        else {
            setSelectedSeats([...selectedSeats, seatNumber]); // Select
        }
    };

    const onLockSeat = async (currentFlightId, selectedSeats) => {
        console.log(currentFlightId, selectedSeats)
        Swal.fire({

            title: "Are you Sure?",
            text: `Do you really want to Lock the ${selectedSeats.length > 1 ? "seats" : "seat"} ${selectedSeats} ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            try {
                const lockSeatResponse = await axios.patch(`${lockSeatsApi}${currentFlightId}?seatNo=${selectedSeats}`)
                setCount(count + 1)
                const modalElement = document.getElementById('selectSeatsModal')
                const modalInst = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
                modalInst.hide()

                Swal.fire("Locked!", `The ${selectedSeats.length > 1 ? "seats" : "seat"} ${selectedSeats} ${selectedSeats.length > 1 ? "have" : "has"} been locked successfully`, "success");

                console.log(lockSeatResponse.data)
            }
            catch (err) {
                console.log("Error ", err)
            }
        })
    }

    const toUnlock = async (currentFlightId, selectedSeats) => {
        console.log(currentFlightId, selectedSeats)
        Swal.fire({
            title: "Are you Sure?",
            text: `Do you really want to Unlock the ${selectedSeats.length > 1 ? "seats" : "seat"} ${selectedSeats} ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if(result.isConfirmed){
            try {
                const unlockSeatResponse = await axios.patch(`${unlockSeatsApi}${currentFlightId}?seatNo=${selectedSeats}`)
                setCount(count + 1)
                const modalElement = document.getElementById('modalForUnlock')
                const modalInst = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
                modalInst.hide()

                Swal.fire("Unlocked!", `The ${selectedSeats.length > 1 ? "seats" : "seat"} ${selectedSeats} ${selectedSeats.length > 1 ? "have" : "has"} been unlocked successfully`, "success");
                console.log(unlockSeatResponse.data)
            }
            catch (err) {
                console.log("Error ", err)
            }}
        })
    }

    const onCancelFlight=(fid,fnumber)=>{
        Swal.fire({
            title: "Are you Sure?",
            text: `Do you really want to cancel the flight ${fnumber} ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async(result)=>{
            try{
                const resp = await axios.put(`${cancelFlightApi}${fid}`,undefined,
                    {
                        headers:{
                            'Authorization': 'Bearer '+token
                        }
                    }
                )
                console.log(resp)
                console.log(resp.data)
                Swal.fire("","The flight has been successfully cancelled!","success")
                setCount(count+1)
            }
            catch(err){
                console.log("error is",err)
            }
        })
    }

    const filterFlights = (searchStr)=>{
        if(!searchStr){
            setSearch(dispFlights)
            return
        }

        const regex = new RegExp(searchStr.replace(/%/g,'.*').replace(/_/g,'.'),'i');

        setSearch([...dispFlights.filter(df=>df.flightNumber.match(regex))])
        

    }

    return (
        <div>{

            (username != null && username != undefined) ?
                <div className="container-fluid px-5 mt-5">
                    <button className=" btn btn-primary mt-4 fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal">+ Add Flight</button> <br /> <br />
                    <div className="mb-3" style={{ maxWidth: '400px' }}>
                                            <input type="text" className="form-control border-3" placeholder={"🔍 Search by Flight Number"} onChange={(e) => {
                                                filterFlights(e.target.value)
                                            }} />
                                        </div>
                    {/* <!-- Add flight Modal --> */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Add New Flight</h5>
                                    <button type="button" className="btn-close btn-close-white" id="closeAddModalBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form id="flightForm" onSubmit={onadd}>
                                        <div className="mb-3">
                                            <label className="form-label">Flight Number</label>
                                            <input type="text" className="form-control"
                                                value={flightNumber}
                                                onChange={(e) => setFlightNumber(e.target.value)}
                                                placeholder="Ex : A330ING4" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Origin</label>
                                            <input type="text" className="form-control"
                                                value={origin}
                                                onChange={(e) => setOrigin(e.target.value)}
                                                placeholder="Ex : Chennai" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Destination</label>
                                            <input type="text" className="form-control"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                placeholder="Ex : San Fransisco" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Departure Date & Time</label>
                                            <input type="datetime-local" className="form-control"
                                                value={departureTime}
                                                onChange={(e) => setDepartureTime(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Arrival Date & Time</label>
                                            <input type="datetime-local" className="form-control"
                                                value={arrivalTime}
                                                onChange={(e) => setArrivalTime(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Base Price (₹)</label>
                                            <input type="number" step="0.01" className="form-control"
                                                value={basePrice}
                                                onChange={(e) => setBasePrice(e.target.value)} placeholder="14700.00" required />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" form="flightForm" className="btn btn-primary">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EDIT FLIGHT MODAL */}
                    <div className="modal fade" id="editFlightModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Edit Flight Details</h5>
                                    <button type="button" className="btn-close btn-close-white" id="closeEditModalBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body">
                                    <form id="editFlightform" onSubmit={onEditSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Flight Number</label>
                                            <input type="text" className="form-control" name="flightId" value={editFlight.flightId} disabled={true} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Flight Number</label>
                                            <input type="text" className="form-control" name="flightNumber" value={editFlight.flightNumber} onChange={handleEditChange} required />
                                        </div>

                                        <div className="mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Origin</label>
                                                <input type="text" className="form-control" name="origin" value={editFlight.origin} onChange={handleEditChange} required />
                                            </div>
                                            <div className=" mb-3">
                                                <label className="form-label fw-bold">Destination</label>
                                                <input type="text" className="form-control" name="destination" value={editFlight.destination} onChange={handleEditChange} required />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Departure Time</label>
                                                <input type="datetime-local" className="form-control" name="departureTime"
                                                    value={editFlight.departureTime ? editFlight.departureTime.substring(0, 16) : ''}
                                                    onChange={handleEditChange} required />
                                            </div>
                                            <div className=" mb-3">
                                                <label className="form-label fw-bold">Arrival Time</label>
                                                <input type="datetime-local" className="form-control" name="arrivalTime"
                                                    value={editFlight.arrivalTime ? editFlight.arrivalTime.substring(0, 16) : ''}
                                                    onChange={handleEditChange} required />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Base Price (Economy)</label>
                                            <input type="number" className="form-control" name="basePrice" value={editFlight.basePrice} onChange={handleEditChange} required />
                                        </div>
                                    </form>

                                </div>
                                <div className="modal-footer ">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Cancel
                                    </button>
                                    <button type="submit" form="editFlightform" className="btn btn-primary">
                                        <strong>Update</strong>
                                    </button>


                                </div>

                            </div>

                        </div>
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
                                                        <button
                                                            title="Edit"
                                                            disabled={df.status==='CANCELLED'}
                                                            className="btn btn-link text-primary p-1"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editFlightModal"
                                                            onClick={() => setEditFlight(df)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <div className="dropdown d-inline-block">
                                                            <button
                                                                title="View Options"
                                                                className="btn btn-link text-primary p-1"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="bi bi-eye fs-5"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#selectSeatsModal"
                                                                        onClick={() => fetchSeats(df.flightId)}
                                                                    >
                                                                        Lock Seats
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#modalForUnlock"
                                                                        onClick={() => fetchSeats(df.flightId)}
                                                                    >
                                                                        Unlock Seats
                                                                    </button>
                                                                </li>
                                                            </ul>

                                                        </div>
                                                        <button
                                                            title="Cancel Flight"
                                                            disabled={df.status==='CANCELLED'}
                                                            className="btn btn-link text-danger p-1"
                                                            onClick={() => onCancelFlight(df.flightId, df.flightNumber)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* View Seat & Lock modal */}
                    <style>{`
                .seat-btn { width: 45px; height: 45px; margin: 4px; border-radius: 8px 8px 4px 4px; font-size: 12px; font-weight: bold; border: 2px solid #ccc; background-color: white; cursor: pointer; transition: all 0.2s; }
                .seat-btn:hover:not(:disabled) { border-color: #0d6efd; }
                .seat-available { border-color: #198754; color: #198754; }
                .seat-selected { background-color: #0d6efd; color: white; border-color: #0d6efd; }
                .seat-booked { background-color: #e9ecef; color: #adb5bd; border-color: #dee2e6; cursor: not-allowed; }
                .seat-locked {background-color: #f17174; color: #fbfdff; border-color: #dee2e6; cursor: not-allowed;}
                .seat-business { border-width: 3px; border-color: #6f42c1; color: #6f42c1; }
                .aisle-gap { margin-right: 35px; }
            `}</style>
                    <div className="modal fade" id="selectSeatsModal" >

                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title fw-bold">Select Seats to lock</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body bg-light pb-4">

                                    <div className="d-flex flex-column align-items-center">
                                        {/* seat view  */}
                                        <div className="bg-white p-4 rounded shadow-sm border">
                                            <div className="text-center text-muted mb-3 pb-2 border-bottom fw-bold" style={{ letterSpacing: '2px' }}>FRONT OF PLANE</div>

                                            {Object.entries(groupSeatsByRow()).map(([rowNum, rowSeats]) => (
                                                <div key={rowNum} className="d-flex justify-content-center mb-1">

                                                    {/*each seat in the row */}
                                                    {rowSeats.map((seat, index) => {
                                                        const isSelected = selectedSeats.includes(seat.seatNumber);
                                                        const isUnavailable = seat.status === "BOOKED";
                                                        const isLocked = seat.status === "LOCKED";
                                                        const isBusiness = seat.seatClass === "BUSINESS";

                                                        let seatClassNames = "seat-btn ";
                                                        if (isUnavailable) seatClassNames += "seat-booked ";
                                                        else if (isSelected) seatClassNames += "seat-selected ";
                                                        else if (isLocked) seatClassNames += "seat-locked ";
                                                        else if (isBusiness) seatClassNames += "seat-business shadow-sm ";
                                                        else seatClassNames += "seat-available ";
                                                        // Add Aisle gap after the 3rd seat (Index 2)
                                                        if (index === 2) seatClassNames += "aisle-gap ";
                                                        return (
                                                            <button
                                                                key={seat.seatId}
                                                                className={seatClassNames}
                                                                disabled={ isLocked}
                                                                onClick={() => toggleSeatSelection(seat.seatNumber)}
                                                                title={`${seat.seatClass} Class - ${seat.status}`}
                                                            >
                                                                {seat.seatNumber}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>

                                        {/* --Seat rules info-- */}
                                        <div className="mt-4 d-flex justify-content-between w-100 px-2 px-md-4">
                                            <div className="d-flex gap-2 gap-md-3 text-center" style={{ fontSize: '14px' }}>
                                                <div><span className="badge border border-success text-success bg-white px-3 py-2">Available</span></div>
                                                <div><span className="badge border border-primary bg-primary text-white px-3 py-2">Selected</span></div>
                                                <div><span className="badge bg-secondary px-3 py-2">Booked</span></div>
                                                <div><span className="badge border text-purple bg-white px-3 py-2" style={{ borderColor: '#6f42c1', color: '#6f42c1' }}>Business</span></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="modal-footer d-flex justify-content-between bg-light">
                                    <div>
                                        <span className="fw-bold text-secondary">Selected: </span>
                                        <span className="text-primary fw-bold">
                                            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                                        </span>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-4 fw-bold"
                                            disabled={selectedSeats.length === 0}
                                            onClick={() => {
                                                // 1. Force remove all bootstrap backdrop elements lingering in the DOM
                                                const backdrops = document.querySelectorAll('.modal-backdrop, .offcanvas-backdrop');
                                                backdrops.forEach(el => el.remove());

                                                // 2. Clear block flags locked onto the main body element
                                                document.body.classList.remove('modal-open', 'offcanvas-open');
                                                document.body.style.overflow = 'unset';
                                                document.body.style.paddingRight = 'unset';

                                                onLockSeat(currentFlightId, selectedSeats)
                                            }}
                                        >
                                            Lock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Seats & Unlock */}

                    <style>{`
                .seat-btn { width: 45px; height: 45px; margin: 4px; border-radius: 8px 8px 4px 4px; font-size: 12px; font-weight: bold; border: 2px solid #ccc; background-color: white; cursor: pointer; transition: all 0.2s; }
                .seat-btn:hover:not(:disabled) { border-color: #0d6efd; }
                .seat-available { border-color: #198754; color: #198754; }
                .seat-selected { background-color: #0d6efd; color: white; border-color: #0d6efd; }
                .seat-booked { background-color: #e9ecef; color: #adb5bd; border-color: #dee2e6; cursor: not-allowed; }
                .seat-locked {background-color: #f17174; color: #fbfdff; border-color: #dee2e6; cursor: not-allowed;}
                .seat-business { border-width: 3px; border-color: #6f42c1; color: #6f42c1; }
                .aisle-gap { margin-right: 35px; }
            `}</style>
                    <div className="modal fade" id="modalForUnlock" >

                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title fw-bold">Select Seats to Unlock</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body bg-light pb-4">

                                    <div className="d-flex flex-column align-items-center">
                                        {/* seat view  */}
                                        <div className="bg-white p-4 rounded shadow-sm border">
                                            <div className="text-center text-muted mb-3 pb-2 border-bottom fw-bold" style={{ letterSpacing: '2px' }}>FRONT OF PLANE</div>

                                            {Object.entries(groupSeatsByRow()).map(([rowNum, rowSeats]) => (
                                                <div key={rowNum} className="d-flex justify-content-center mb-1">

                                                    {/*each seat in the row */}
                                                    {rowSeats.map((seat, index) => {
                                                        const isSelected = selectedSeats.includes(seat.seatNumber);
                                                        const isUnavailable = seat.status === "BOOKED" || seat.status === "AVAILABLE";
                                                        const isLocked = seat.status === "LOCKED";

                                                        let seatClassNames = "seat-btn ";
                                                        if (isUnavailable) seatClassNames += "seat-booked ";
                                                        else if (isSelected) seatClassNames += "seat-selected ";
                                                        else if (isLocked) seatClassNames += "seat-locked ";
                                                        else seatClassNames += "seat-available ";
                                                        // Add Aisle gap after the 3rd seat (Index 2)
                                                        if (index === 2) seatClassNames += "aisle-gap ";
                                                        return (
                                                            <button
                                                                key={seat.seatId}
                                                                className={seatClassNames}
                                                                disabled={isUnavailable}
                                                                onClick={() => toggleSeatSelection(seat.seatNumber)}
                                                                title={`${seat.seatClass} Class - ${seat.status}`}
                                                            >
                                                                {seat.seatNumber}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>

                                        {/* --Seat rules info-- */}
                                        <div className="mt-4 d-flex justify-content-between w-100 px-2 px-md-4">
                                            <div className="d-flex gap-2 gap-md-3 text-center" style={{ fontSize: '14px' }}>
                                                <div><span className="badge border border-primary bg-primary text-white px-3 py-2">Selected</span></div>
                                                <div><span className="badge bg-danger px-3 py-2">Locked</span></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="modal-footer d-flex justify-content-between bg-light">
                                    <div>
                                        <span className="fw-bold text-secondary">Selected: </span>
                                        <span className="text-primary fw-bold">
                                            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                                        </span>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-4 fw-bold"
                                            disabled={selectedSeats.length === 0}
                                            onClick={() => {
                                                // 1. Force remove all bootstrap backdrop elements lingering in the DOM
                                                const backdrops = document.querySelectorAll('.modal-backdrop, .offcanvas-backdrop');
                                                backdrops.forEach(el => el.remove());

                                                // 2. Clear block flags locked onto the main body element
                                                document.body.classList.remove('modal-open', 'offcanvas-open');
                                                document.body.style.overflow = 'unset';
                                                document.body.style.paddingRight = 'unset';
                                                toUnlock(currentFlightId, selectedSeats)
                                            }}
                                        >
                                            Unlock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> :
                <div className="alert alert-danger role-alert fw-medium text-center py-2" style={{ borderRadius: '6px' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>Login to view Details
                </div>
        }
        </div >
    )
}

export default ManageFlight