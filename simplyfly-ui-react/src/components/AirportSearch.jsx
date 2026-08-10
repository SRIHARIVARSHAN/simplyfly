import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AirportSearch({ value, onChange, placeholder }){
    const [airports, setAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Fetch ALL airports 
    useEffect(() => {
        const fetchAllAirports = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/api/airports/all`);
                setAirports(resp.data);
                setFilteredAirports(resp.data);
            } catch (err) {
                console.error("Error fetching airports", err);
            }
        };
        fetchAllAirports();
    }, []);

    // Filter on typing
    const handleTyping = (ap) => {
        const text = ap;
        onChange(text);
        setIsOpen(true);

        const filtered = airports.filter(airport => 
            airport.cityName.toLowerCase().includes(text.toLowerCase()) || 
            airport.airportCode.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredAirports(filtered);
    };

    const handleSelectOption = (airport) => {
        onChange(airport.cityName); 
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="position-relative" ref={wrapperRef}>
            
            <style>{`
                .flight-input-wrapper {
                    border: 1px solid #dadce0;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .flight-input-wrapper:focus-within {
                    border-color: #1a73e8;
                    box-shadow: 0 0 0 1px #1a73e8;
                }
                .flight-dropdown-item {
                    transition: background-color 0.1s;
                    cursor: pointer;
                }
                .flight-dropdown-item:hover {
                    background-color: #b1cce2;
                }
                .airport-code-box {
                    background-color: #f1f3f4;
                    color: #5f6368;
                    min-width: 44px;
                    height: 28px;
                    font-size: 13px;
                }
            `}</style>


            <div 
                className="flight-input-wrapper d-flex align-items-center bg-white px-3 py-2" 
                onClick={() => setIsOpen(true)}
            >
                {/* flight icon */}
                <svg focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="#1a73e8" className="me-2">
                    <path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"></path>
                </svg>

                <input
                    type="text"
                    className="form-control border-0 shadow-none p-0 fw-normal"
                    style={{ fontSize: '16px', color: '#3c4043' }}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e)=>handleTyping(e.target.value)}
                    required
                />
            </div>
            
            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    className="dropdown-menu show w-100 position-absolute mt-1 shadow-sm border-0 py-2" 
                    style={{ 
                        
                        top: '100%', 
                        zIndex: 1000, 
                        maxHeight: '350px', 
                        overflowY: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'
                    }}
                >
                    {filteredAirports.length > 0 ? (
                        filteredAirports.map((airport) => (
                            <div 
                                key={airport.airportCode} 
                                className="flight-dropdown-item d-flex align-items-center px-3 py-2"
                                onClick={() => handleSelectOption(airport)}
                            >
                                {/* Airport Code Block */}
                                <div className="airport-code-box rounded d-flex justify-content-center align-items-center fw-bold me-3" style={{backgroundColor:"#1a73e8",color:'white'}}>
                                    {airport.airportCode}
                                </div>
                                
                                {/* City and Airport Name Text */}
                                <div className="text-truncate text-dark" style={{ fontSize: '18px' }}>
                                    {airport.cityName}, IN - {airport.airportName} {airport.airportName.includes(airport.airportCode) ? '' : `(${airport.airportCode})`}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-muted text-center">No airports found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AirportSearch;

