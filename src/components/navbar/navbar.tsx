import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserType } from "../../models/UserType";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import "./navbar.css";

export default function Navbar() {
    let currentUser = useSelector((state: AppState) => state.currentUser);
    let isUser = (currentUser.typeOfUser === UserType.User);
    let isGuest = (currentUser.typeOfUser === UserType.Guest);
    let isAdmin = (currentUser.typeOfUser === UserType.Admin);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.socket) {
            initSocketListeners(currentUser.socket)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleAdminPage = () => {
        navigate("/admin");
    }

    const handleHome = () => {
        navigate("/");
    }

    const handleLogOut = () => {
        axios.defaults.headers.common['Authorization'] = '';
        sessionStorage.removeItem("userDetails");
        currentUser.socket?.disconnect();
        const guestSocket = io('http://localhost:3002/', {}).connect();
        dispatch({ type: ActionType.GetGuestSocket, payload: guestSocket });
        dispatch({ type: ActionType.handleLogOut });
    }

    const handleLogIn = () => {
        dispatch({ type: ActionType.ToggleLogInModal });
    }

    const handleRegister = () => {
        dispatch({ type: ActionType.ToggleRegisterModal });
    }

    const handleAddVacation = () => {
        dispatch({ type: ActionType.ToggleVacationModal });
    }

    function initSocketListeners(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on("delete-vacation", (vacationId) => {
            dispatch({ type: ActionType.DeleteCard, payload: vacationId });
        });

        socket.on("add-or-edit-vacation", (vacationJson) => {
            let vacation = JSON.parse(vacationJson);
            dispatch({ type: ActionType.addOrEditVacation, payload: vacation });
        });
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light ">
            <div className="container">

                <span id="title" className="navbar-brand"> Vacation </span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navmenu">
                    <ul className="navbar-nav justify-content-center">

                        {isAdmin && (<li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleHome()}>Home</button>
                        </li>)}

                        {isAdmin && (<li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleAddVacation()}>Add Vacation</button>
                        </li>)}

                        {isAdmin && (<li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleAdminPage()}>Admin Page</button>
                        </li>)}

                        {(isUser || isAdmin) && <li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleLogOut()}>Log Out</button>
                        </li>}

                        {isGuest && <li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleLogIn()}>Log In</button>
                        </li>}

                        {isGuest && <li className="nav-item">
                            <button className="btn nav-link" onClick={() => handleRegister()}>Register</button>
                        </li>}

                    </ul>
                </div>
                <span className="navbar-brand justify-content-end"> Hello {currentUser.firstName} {currentUser.lastName}</span>
            </div>
        </nav>
    );
}