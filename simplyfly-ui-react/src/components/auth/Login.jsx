import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router"

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
    const navigate = useNavigate()

    const onLogin = async (e) => {

        e.preventDefault()
        let authToken = window.btoa(username + ":" + password)
        console.log(username + ":" + password)
        console.log(authToken)
        let config = {
            headers: {
                'Authorization': 'Basic ' + authToken
            }
        }
        try {
            const resp = await axios.get('http://localhost:8080/api/auth/login', config)

            localStorage.setItem('username', username)
            localStorage.setItem('token', resp.data?.token)
            localStorage.setItem('role', resp.data?.role)

            switch (resp.data?.role) {
                case 'ADMIN':
                    navigate('/admin/search')
                    break;
                case 'PASSENGER':
                    navigate('/')
                    break;
                case 'FLIGHT_OWNER':
                    navigate('/flightOwner/search')
                    break;
            }
        }
        catch (err) {
            setErrorMessage('Invalid credentials')
        }
    }

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center bg-light bg-gradient" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "420px" }}>
                <div className="card border-0 shadow-lg p-4 rounded-4 bg-white">
                    <div className="card-body">
                        
                        <div className="text-center mb-4">
                            <h2 className="fw-extrabold text-dark m-0">
                                <span className="text-primary">Simply</span>Fly
                            </h2>
                            <p className="text-secondary small mt-2">Please sign in to manage your flight bookings</p>
                        </div>

                        <form onSubmit={onLogin}>
                            {errorMsg !== '' && (
                                <div className="alert alert-danger border-0 rounded-3 py-2 px-3 small text-center mb-4 shadow-sm animate-fade-in">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill px-3 py-2 border-light-subtle shadow-sm"
                                    placeholder="Enter your username"
                                    required
                                    onChange={($event) => {
                                        setUsername($event.target.value)
                                        setErrorMessage('')
                                    }} 
                                />
                            </div>

                            {/* Password Field with Show/Hide toggle option */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">Password</label>
                                <div className="input-group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-control rounded-start-pill px-3 py-2 border-light-subtle shadow-sm"
                                        placeholder="Enter your password"
                                        required
                                        onChange={($event) => {
                                            setPassword($event.target.value)
                                            setErrorMessage('')
                                        }} 
                                    />
                                    <button 
                                        className="btn btn-outline-secondary rounded-end-pill px-3 border-light-subtle shadow-sm" 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <small className="fw-bold">{showPassword ? "Hide" : "Show"}</small>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 d-grid">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm transition-transform btn-hover-scale"
                                >
                                    Sign In
                                </button>
                            </div>

                            
                            <div className="text-center small text-secondary mt-2">
                                Don't have an account? &nbsp;
                                <Link to='/sign-up' className="text-primary fw-bold text-decoration-none hover-link-underline">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
