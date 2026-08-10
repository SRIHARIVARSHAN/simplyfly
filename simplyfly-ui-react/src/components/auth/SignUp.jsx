import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('passenger'); // default role
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMessage] = useState('');
  const navigate = useNavigate()


  const addUserApi = "http://localhost:8080/api/user/add"

  const onSignUp = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email, phone, password, role, companyName };
      const resp = await axios.post(`${addUserApi}`, payload)
      console.log("Done ", resp.data)
      role === "FLIGHT_OWNER" ? navigate("/flightOwner/search") : navigate("/")
    }
    catch (err) {
      console.log("Error is: ", err)
      setErrorMessage("Email or phone number is already registered!")
    }

    console.log({ name, email, password, role, companyName, phone });
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center bg-light bg-gradient" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="card border-0 shadow-lg p-4 rounded-4 bg-white">
          <div className="card-body">
            <div className="text-center mb-4">
              <h2 className="fw-extrabold text-dark m-0">
                <span className="text-primary">Simply</span>Fly
              </h2>
              <p className="text-secondary small mt-2">Create your account to start flying</p>
            </div>

            <form onSubmit={(e) => onSignUp(e)}>
              {errorMsg !== '' && (
                <div className="alert alert-danger border-0 rounded-3 py-2 px-3 small text-center mb-4 shadow-sm animate-fade-in">
                  {errorMsg}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill px-3 py-2 border-light-subtle shadow-sm"
                  placeholder="Enter your full name"
                  required
                  onChange={($event) => {
                    setName($event.target.value)
                    setErrorMessage('')
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-pill px-3 py-2 border-light-subtle shadow-sm"
                  placeholder="Enter your email"
                  required
                  onChange={($event) => {
                    setEmail($event.target.value)
                    setErrorMessage('')
                  }}
                />
              </div>

            
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Phone Number</label>
                <input
                  type="tel"
                  className="form-control rounded-pill px-3 py-2 border-light-subtle shadow-sm"
                  placeholder="Enter your phone number"
                  required
                  onChange={($event) => {
                    setPhone($event.target.value) 
                    setErrorMessage('')
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control rounded-start-pill px-3 py-2 border-light-subtle shadow-sm"
                    placeholder="Create a password"
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

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small d-block">Register As</label>
                <div className="d-flex gap-4 px-2 mt-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="rolePassenger"
                      value="passenger"
                      checked={role === 'PASSENGER'}
                      onChange={() => setRole('PASSENGER')}
                    />
                    <label className="form-check-label text-dark small" htmlFor="rolePassenger">
                      Passenger
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="roleOwner"
                      value="owner"
                      checked={role === 'FLIGHT_OWNER'}
                      onChange={() => setRole('FLIGHT_OWNER')}
                    />
                    <label className="form-check-label text-dark small" htmlFor="roleOwner">
                      Flight Owner
                    </label>
                  </div>
                </div>
              </div>

              {role === 'FLIGHT_OWNER' && (
                <div className="mb-4 animate-fade-in">
                  <label className="form-label fw-semibold text-secondary small">Company Name</label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 border-light-subtle shadow-sm"
                    placeholder="Enter your airline/company name"
                    required
                    onChange={($event) => {
                      setCompanyName($event.target.value)
                      setErrorMessage('')
                    }}
                  />
                </div>
              )}

              <div className="d-grid mt-4 ">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm transition-transform btn-hover-scale"
                >
                  Sign Up
                </button>
              </div>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
