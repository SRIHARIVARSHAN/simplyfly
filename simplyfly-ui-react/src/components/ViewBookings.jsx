import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";

function ViewBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancel, setCancel] = useState('Cancel')
    const [error, setError] = useState("");
    const [count, setCount] = useState(0)

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }


    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {

                const resp = await axios.get("http://localhost:8080/api/booking/history", config)
                setBookings(resp.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load booking history. Please try again.");
            }
        };

        fetchBookingHistory();
    }, [count]);

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const toCancel = (bookingId, passengerId,eticket) => {
        console.log(bookingId,passengerId)
        Swal.fire({
            title: "Are you Sure?",
            text: `Do you really want to Cancel the ticket? If you cancel 24 hours before flight you will get only 70% Refund amount. Kindly check our Cancellation policy for more information`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (!result.isConfirmed) return; 
            
            const { value: enteredTicket } = await Swal.fire({
            title: "e-Ticket Number",
            input: "text",
            inputLabel: "Your e-Ticket Number",
            inputPlaceholder: "Enter your e-Ticket Number to cancel"
        });
        if (enteredTicket !== eticket) {
            Swal.fire("Error", "The entered e-Ticket number does not match our records.", "error");
            return;
        }
                try {
                    const resp = await axios.post('http://localhost:8080/api/ticket/cancel',{
                        bookingId: bookingId,
                        passengerId: [passengerId]
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    Swal.fire("Cancelled!", "The ticket has been successfully cancelled. Your refund has been processed.", "success");                    
                    setCount(count + 1)
                    console.log(resp.data)
                }
                catch (err) {
                    console.log("The problem is", err)
                }
            
        })

    }

    return (
        <div className="bg-light min-vh-100">
            <NavBar />

            <div className="container mt-4 pb-5 col-8">
                <h2 className="mb-4 fw-bold text-primary">My Trips</h2>

                {/* error message */}
                {error && (
                    <div className="alert alert-danger text-center mt-3">{error}</div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="text-center py-5 bg-white rounded shadow-sm border">
                        <h4 className="text-muted mb-2">No bookings found!</h4>
                        <p className="text-secondary mb-0">Looks like you haven't booked any flights yet.</p>
                    </div>
                )}

                {bookings.length > 0 && (
                    <div className="row">
                        {bookings.map((booking, index) => (
                            <div className="col-12 mb-4" key={index + 1}>
                                <div className="card shadow-sm border-0">

                                    <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <span className="text-muted small d-block">Booked on {formatDate(booking.bookingDate)}</span>
                                            <span className="fw-bold text-dark">Booking ID: #{booking.bookingId}</span>
                                        </div>
                                        <span className={`badge px-3 py-3 ${booking.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </div>

                                    <div className="card-body row align-items-center py-4">
                                        <div className="col-md-8 border-end-md">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-primary text-white rounded px-2 py-1 me-3 fw-bold small">
                                                    {booking.flightNumber}
                                                </div>
                                                <h5 className="mb-0 fw-bold">
                                                    {booking.origin.toUpperCase()} <span className="text-muted px-2">TO</span> {booking.destination.toUpperCase()}
                                                </h5>
                                            </div>
                                            <p className="mb-0 text-muted">
                                                <strong className="text-dark">Departure:</strong> {formatDate(booking.departureTime)}
                                            </p>
                                        </div>
                                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                            <div className="text-muted small">Total Paid ({booking.paymentMethod=='UPI'?'UPI':"CREDIT CARD"})</div>
                                            <h4 className="fw-bold text-success mb-1">{formatINR(booking.totalAmount)}</h4>
                                            <span className="badge border border-success text-success bg-white me-3">Payment: {booking.paymentStatus}</span>
                                            {(booking.passengers.some(p=>p.passengerStatus !== 'ACTIVE')) ?
                                                <span className="badge border border-success text-primary bg-white">Refunded Amount: {formatINR(booking.refundedAmount)}</span>
                                                : ""}

                                        </div>
                                    </div>
                                    <div className="card-footer bg-light py-3">
                                        <h6 className="fw-bold mb-3 text-secondary">Passenger Details</h6>
                                        <div className="table-responsive">
                                            <table className="table table-sm table-borderless mb-0">
                                                <thead className="border-bottom">
                                                    <tr className="text-muted small">
                                                        <th>Name</th>
                                                        <th>Gender / Age</th>
                                                        <th>Seat</th>
                                                        <th>Class</th>
                                                        <th>e-Ticket Number</th>
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {booking.passengers.map((passenger, idx) => (
                                                        <tr key={idx} className={passenger.passengerStatus === 'CANCELLED' ? 'text-decoration-line-through text-muted' : ''}>
                                                            <td className="fw-semibold">{passenger.passengerName}</td>
                                                            <td>{passenger.gender}, {passenger.age}</td>
                                                            <td className="fw-bold text-primary">{passenger.seatNumber}</td>
                                                            <td><span className="badge bg-secondary">{passenger.seatClass}</span></td>
                                                            <td><small className="text-muted">{passenger.eTicketNumber}</small></td>
                                                            <td><small className="text-muted">
                                                                <button className={`btn btn-sm ${passenger.passengerStatus === 'CANCELLED' ? 'btn-secondary' : 'btn-danger'}`}
                                                                    disabled={passenger.passengerStatus === 'CANCELLED'}
                                                                    onClick={() => toCancel( booking.bookingId,passenger.passengerId,passenger.eTicketNumber)}
                                                                >{passenger.passengerStatus === 'CANCELLED' ? 'Cancelled' : "Cancel"}
                                                                </button>
                                                            </small>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewBookings;