import axios from "axios"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router"

function Book() {
    const location = useLocation()
    const navigate = useNavigate()

    const { flightId, seats, basePrice } = location.state || { flightId: null, seats: [], basePrice: 0 }

    const [passengers, setPassengers] = useState(
        seats.map(seat => ({
            passengerName: '',
            age: '',
            gender: '',
            seatNumber: seat.seatNumber
        }))
    )

    const [paymentMethod, setPaymentMethod] = useState('UPI');

    const calculateTotal = () => {
        return seats.reduce((total, seat) => {
            const seatPrice = seat.seatClass === 'BUSINESS' ? (basePrice * 3.18) : basePrice;
            return total + seatPrice;
        }, 0);
    };

    const totalAmount = calculateTotal();

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const InputChange = (index, field, value) => {
        const updatedPassengers = [...passengers]
        updatedPassengers[index][field] = value
        setPassengers(updatedPassengers)

    }

    const bookTicket = async (e) => {
        e.preventDefault()

        const details = {
            flightId: flightId,
            paymentMethod: paymentMethod,
            coPassengers: passengers
        }
        console.log(details)

        try {
            const token = localStorage.getItem('token')
            const resp = await axios.post('http://localhost:8080/api/booking/add', details, {
                headers: {
                    "Authorization": 'Bearer ' + token
                }
            })

        }
        catch (err) {
            console.log("Reason ", err)
        }
    }

    const onPaid = () => {
        Swal.fire({
            title: "Your Ticket for the Trip has been confirmed!",
            text: "Thank you for choosing us",
            icon: "success"  
        }).then((result)=>{
            navigate('/view-bookings')
        });
    }


    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-primary fw-bold">Complete Your Booking</h2>

            <form onSubmit={(e) => bookTicket(e)} >
                <div className="row">
                    <div className="col-md-8">

                        {passengers.map((passenger, index) => (
                            <div className="card mb-4 shadow-sm border-0 bg-light" key={index}>
                                <div className="card-header bg-secondary text-white fw-bold d-flex justify-content-between">
                                    <span>Passenger {index + 1}</span>
                                    <span>Seat: {passenger.seatNumber}</span>
                                </div>
                                <div className="card-body row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={passenger.passengerName}
                                            onChange={(e) => InputChange(index, 'passengerName', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Age</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required min="1" max="120"
                                            value={passenger.age}
                                            onChange={(e) => InputChange(index, 'age', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Gender</label>
                                        <select
                                            className="form-select"
                                            required
                                            value={passenger.gender}
                                            onChange={(e) => InputChange(index, 'gender', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment & Submit Section */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="fw-bold border-bottom pb-2 mb-3">Booking Summary</h5>
                                <div className="mb-3 border-bottom pb-2">
                                    {seats.map((seat, idx) => (
                                        <div key={idx} className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: '14px' }}>
                                            <span>Seat {seat.seatNumber} ({seat.seatClass})</span>
                                            <span>{formatINR(seat.seatClass === 'BUSINESS' ? basePrice * 3.18 : basePrice)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold text-dark fs-5">Total Amount</span>
                                    <span className="fw-bold text-success fs-5">{formatINR(totalAmount)}</span>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Payment Method</label>
                                    <select
                                        className="form-select"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="DEBIT_CARD">Debit Card</option>
                                        <option value="NET_BANKING">Net Banking</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 fw-bold py-2"
                                    // disabled={loading}
                                    onClick={() => onPaid()}
                                >
                                    {`Pay ${formatINR(totalAmount)}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>)
}

export default Book