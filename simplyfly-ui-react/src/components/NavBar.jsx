import { Link, NavLink, useNavigate } from "react-router"

function NavBar() {
    const navigate = useNavigate()

    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    const onLogout = () => {

        Swal.fire({
            title: "Are you Sure?",
            text: `Do you want to logout from SimplyFly?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then((result)=>{
            if(result.isConfirmed){
                localStorage.clear()
                navigate('/login')
            }
        })
        
    }

    return (
        <div className="container-fluid p-0">
            <div className="row g-0">
                <div className="col-lg-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-white bg-opacity-75 shadow-sm sticky-top py-3" style={{ backdropFilter: 'blur(10px)' }}>
                        <div className="container">
                            <Link className="navbar-brand fw-bolder fs-3 text-dark tracking-tight d-flex align-items-center" to="">
                                <span className="text-primary me-1" style={{ letterSpacing: '-1px' }}>Simply</span>
                                <span className="text-dark opacity-90 fw-normal">Fly</span>
                            </Link>

                            <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse animate-fade-in" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-lg-4">
                                    {/* Home-search flights */}
                                    <li className="nav-item">
                                        <NavLink
                                                to="/"
                                                end
                                                className={({ isActive }) =>
                                                `nav-link fw-semibold rounded-pill px-3 py-2 transition-all ${isActive
                                                    ? "text-white bg-primary shadow"
                                                    : "text-secondary hover-bg-light"
                                                }`
                                            }
                                            >
                                                Home
                                            </NavLink>
                                    </li>

                                    {/* View Bookings */}
                                    <li className="nav-item">
                                        <NavLink
                                            to={username ? "/view-bookings" : "/login"}
                                            className={({ isActive }) =>
                                                `nav-link fw-semibold rounded-pill px-3 py-2 transition-all ${isActive
                                                    ? "text-white bg-primary shadow"
                                                    : "text-secondary hover-bg-light"
                                                }`
                                            }
                                        >
                                            My Bookings
                                        </NavLink>
                                    </li>

                                    
                                </ul>

                                {/* Refactored Auth State UI element */}
                                <div className="d-flex align-items-center">
                                    {
                                        (!username) ? (
                                            <button
                                                className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition-transform hover-scale"
                                                onClick={() => navigate("/login")}
                                            >
                                                Login
                                            </button>
                                        ) : (
                                            <div className="d-flex align-items-center gap-3 bg-light p-1 pe-3 ps-3 rounded-pill border">
                                                {/* Mini User Avatar Badge */}
                                                <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                                    {username.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="mb-0 text-dark fw-semibold small">
                                                    Welcome, <span className="text-primary">{username.split('@')[0]}</span>
                                                </p>
                                                <div className="vr my-1 bg-secondary opacity-25"></div>
                                                <button
                                                    className="btn btn-link text-danger p-0 border-0 fw-bold small text-decoration-none hover-opacity"
                                                    onClick={onLogout}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default NavBar
