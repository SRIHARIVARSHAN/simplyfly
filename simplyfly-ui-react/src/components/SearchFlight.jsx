import axios from "axios";
import { use, useEffect, useState } from "react";
import AirportSearch from "./AirportSearch";
import { useNavigate } from "react-router";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/bootstrap.css'; 

function SearchFlight() {
    const [selectedDate, setSelectedDate] = useState('');
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [showFlight, setShowFlight] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(5)

    const showFlightApi = "http://localhost:8080/api/search/flights";

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [currentFlightId, setCurrentFlightId] = useState(null);

    const navigate = useNavigate()

    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    // --show Flight----
    const showFlightfun = async () => {
        try {
            //console.log(`${showFlightApi}?from=${origin}&to=${dest}&date=${selectedDate}&page=${page}&size=${size}`)
            const resp =await axios.get(`${showFlightApi}?from=${origin}&to=${dest}&date=${selectedDate}&page=${page}&size=${size}`);
            if (resp.data.length === 0 && page > 0) {
                alertify.error("No more data found! End of the list");
                setPage(page - 1); 
                return; 
            }
            setShowFlight(resp.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
    if (hasSearched === true) {
        showFlightfun(); 
    }
}, [page, size]);

    const handleDateChange = (e) => setSelectedDate(e.target.value);

    const swap = () => {
        setOrigin(dest);
        setDest(origin);
    };

    const onSearch = (e) => {
        e.preventDefault()
        try {
            if (dest !== origin) {
                setHasSearched(true)
                showFlightfun()
            }
            else {
                alert("Both cannot be same")

            }
        }
        catch (err) {

        }
        ;
    };

    const disablePastDates = () => new Date().toISOString().split('T')[0];

    const calcTime = (departure, arrival) => {
        const diff = new Date(arrival) - new Date(departure);
        const totMin = Math.floor(diff / (1000 * 60));
        return `${Math.floor(totMin / 60)}h ${totMin % 60}m`;
    };

    const getDayDiff = (departure, arrival) => {
        const diff = new Date(arrival).getDate() - new Date(departure).getDate();
        return diff > 0 ? `+${diff}Day` : '';
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const fetchSeats = async (flightId) => {
        setCurrentFlightId(flightId);
        setLoadingSeats(true);
        

        try {
            const resp = await axios.get(`http://localhost:8080/api/seats/flight/${currentFlightId}`)
            console.log(resp.data)
            setSeats(resp.data)
        } catch (error) {
            console.error("Error fetching seats:", error);
        } finally {
            setLoadingSeats(false);
        }
    };

    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber)); // Deselect
        } else {
            if (selectedSeats.length < 4) {
                setSelectedSeats([...selectedSeats, seatNumber]); // Select
            } else {
                alertify.error( "You cannot select more than 4 seats at a time")
            }
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
    const computeSize = (sizeVal) => {
        setSize(Number(sizeVal))
    }

    const  computePage = (pageVal)=>{
        switch (pageVal) {
            case 'PREV':
                setPage(page === 0 ? page : page - 1)
                break
            case 'NEXT':
                setPage(page + 1)
                break
        }    }

    return (
        <div className="container  ">
           
            <style>{`
                .seat-btn { width: 45px; height: 45px; margin: 4px; border-radius: 8px 8px 4px 4px; font-size: 12px; font-weight: bold; border: 2px solid #ccc; background-color: white; cursor: pointer; transition: all 0.2s; }
                .seat-btn:hover:not(:disabled) { border-color: #0d6efd; }
                .seat-available { border-color: #198754; color: #198754; }
                .seat-selected { background-color: #0d6efd; color: white; border-color: #0d6efd; }
                .seat-booked { background-color: #e9ecef; color: #adb5bd; border-color: #dee2e6; cursor: not-allowed; }
                .seat-business { border-width: 3px; border-color: #6f42c1; color: #6f42c1; }
                .aisle-gap { margin-right: 35px; }
            `}</style>


            {/* Search Bar */}
            <form onSubmit={onSearch}>
                <div className="container my-4" style={{position:'relative'}} >
                    <div className="card border-0 shadow-sm p-4 rounded-4" style={{ backgroundImage: "linear-gradient(135deg, rgb(190 228 245), rgb(213 238 249))" }}>
                        <div className="row g-3 align-items-center" >

                            <div className="col-md">
                                <div className="input-group">
                                    <div className="form-control p-0 border-start-0 bg-white">
                                        <AirportSearch
                                            placeholder="Enter Origin City"
                                            value={origin}
                                            onChange={setOrigin}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-auto text-center px-1">
                                <button
                                    type="button"
                                    className="btn btn-light border text-primary rounded-circle fw-bold shadow-sm"
                                    style={{ width: "40px", height: "40px", lineHeight: "1" }}
                                    onClick={() => swap()}
                                    title="Swap Origin and Destination"
                                >
                                    ⇄
                                </button>
                            </div>

                            <div className="col-md">
                                <div className="input-group">
                                    <div className="form-control p-0 border-start-0 bg-white">
                                        <AirportSearch
                                            placeholder="Enter Destination City"
                                            value={dest}
                                            onChange={setDest}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">📅</span>
                                    <input
                                        type="date"
                                        className="form-control "
                                        onChange={handleDateChange}
                                        min={disablePastDates()}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-auto col-12">
                                <button
                                    type="submit"
                                    className="btn rounded-3 px-4 py-2 w-100 fw-bold shadow-sm text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #ff9233 0%, #ff6600 100%)',
                                        border: 'none'
                                    }}
                                >
                                    Search Flights
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </form>

            {/* Flight Results Logic */}
            {showFlight.length > 0 ? (
                
                <div>{
                    
                showFlight.map((sf, index) => (
                    <div className="card mb-3 shadow-sm border-1 " key={index}>
                        <div className="card-body p-4">
                            <div className="row align-items-center text-center text-md-start g-3">
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                                        <div className="bg-light rounded p-2 me-3 border text-secondary fw-bold" style={{ width: '50px', height: '50px', display: 'grid', placeItems: 'center' }}>✈️</div>
                                        <div>
                                            <h5 className="mb-0 fw-bold text-dark">{sf.company} - {sf.flightNumber}</h5>
                                            <small className="text-muted">Economy/Business</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row align-items-center">
                                        <div className="col text-end">
                                            <h5 className="mb-0 fw-bold">{sf.departureTime.split('T')[1].substring(0, 5)}</h5>
                                            <span className="text-uppercase fw-semibold text-secondary">{sf.origin}</span>
                                        </div>
                                        <div className="col-5 text-center px-0 position-relative">
                                            <small className="text-muted d-block mb-1">{calcTime(sf.departureTime, sf.arrivalTime)} </small>
                                            <small className="text-muted d-block mb-1">{getDayDiff(sf.departureTime, sf.arrivalTime)} </small>
                                            <div className="position-relative d-flex align-items-center justify-content-center">
                                                <div className="w-100 bg-secondary-subtle" style={{ height: '2px' }}></div>
                                                <span className="position-absolute">⚫</span>
                                            </div>
                                            <small className="text-success d-block mt-1" style={{ fontSize: '1rem' }}>Direct</small>
                                        </div>
                                        <div className="col text-start">
                                            <h5 className="mb-0 fw-bold">{sf.arrivalTime.split('T')[1].substring(0, 5)}</h5>
                                            <span className="text-uppercase fw-semibold text-secondary">{sf.destination}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 border-start-md text-center text-md-end ps-md-4">
                                    <div className="text-muted small mb-1">Price per adult</div>
                                    <h4 className="fw-bold text-success mb-3">{formatINR(sf.basePrice)} to {formatINR(sf.basePrice * 3.18)} </h4>

                                    <button
                                        type="button"
                                        className="btn btn-warning w-100 fw-bold text-white px-4"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectSeatsModal"
                                        onClick={() => fetchSeats(sf.flightId)}
                                    >
                                        Book Seats
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                }
                {/* pagination */}
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 mb-3">
            <button 
                className="btn btn-outline-primary px-3 shadow-sm"
                disabled={page === 0}
                onClick={() => computePage('PREV')}
            >
                &larr; Prev
            </button>

            <span className="badge bg-light text-dark border px-3 py-2 fs-6 shadow-sm fw-normal">
                Page <strong className="text-primary">{page +1}</strong>
            </span>

            <select 
                onChange={($event) => { computeSize($event.target.value); setPage(0); }} 
                className="form-select w-auto shadow-sm text-secondary" 
                value={size}
            >
                <option value={1}>1 / page</option>
                <option value={2}>2 / page</option>
                <option value={3}>3 / page</option>
                <option value={8}>8 / page</option>
            </select>

            <button 
                className="btn btn-outline-primary px-3 shadow-sm"
                disabled={showFlight.length === 0 || showFlight.length < size}
                onClick={() => computePage('NEXT')}
            >
                Next &rarr;
            </button>
        </div>
                </div>
            ) : !hasSearched ? (
                <div className="text-center py-5 text-secondary">
                    <h5>Please Enter your destination and search.</h5>
                </div>
            ) : (
                <div className="text-center py-5 bg-light rounded border">
                    <h4 className="text-muted mb-2">No Flights Available!</h4>
                    <p className="text-secondary mb-0">Try other dates or destinations.</p>
                </div>
            )}

            

            {/* seat select modal */}
            <div className="modal fade" id="selectSeatsModal" >
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title fw-bold">Select Seats (Max 4)</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body bg-light pb-4">
                            {loadingSeats ? (
                                <div className="text-center my-5">
                                    <div className="spinner-border text-secondary" role="status"></div>
                                    <p className="mt-2 text-muted">Loading seating chart...</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center">
                                    {/* seat view  */}
                                    <div className="bg-white p-4 rounded shadow-sm border">
                                        <div className="text-center text-muted mb-3 pb-2 border-bottom fw-bold" style={{ letterSpacing: '2px' }}>FRONT OF PLANE</div>

                                        {Object.entries(groupSeatsByRow()).map(([rowNum, rowSeats]) => (
                                            <div key={rowNum} className="d-flex justify-content-center mb-1">

                                                {/*each seat in the row */}
                                                {rowSeats.map((seat, index) => {
                                                    const isSelected = selectedSeats.includes(seat.seatNumber);
                                                    const isUnavailable = seat.status === "BOOKED" || seat.status === "LOCKED";
                                                    const isBusiness = seat.seatClass === "BUSINESS";

                                                    // Dynamic CSS classes
                                                    let seatClassNames = "seat-btn ";
                                                    if (isUnavailable) seatClassNames += "seat-booked ";
                                                    else if (isSelected) seatClassNames += "seat-selected ";
                                                    else if (isBusiness) seatClassNames += "seat-business shadow-sm ";
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
                                            <div><span className="badge border border-success text-success bg-white px-3 py-2">Available</span></div>
                                            <div><span className="badge border border-primary bg-primary text-white px-3 py-2">Selected</span></div>
                                            <div><span className="badge bg-secondary px-3 py-2">Booked</span></div>
                                            <div><span className="badge border text-purple bg-white px-3 py-2" style={{ borderColor: '#6f42c1', color: '#6f42c1' }}>Business</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}
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

                                        if (!username) {
                                            navigate("/login")
                                            if(username){

                                            }
                                        } else {
                                            const selectedFlight = showFlight.find(f => f.flightId === currentFlightId);
                                            const flightBasePrice = selectedFlight ? selectedFlight.basePrice : 0;

                                            const fullSelectedSeats = seats.filter(s => selectedSeats.includes(s.seatNumber));
                                            navigate("/book", {
                                                state: {
                                                    flightId: currentFlightId,
                                                    seats: fullSelectedSeats,
                                                    basePrice: flightBasePrice
                                                }
                                            })
                                        }
                                    }}

                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchFlight;