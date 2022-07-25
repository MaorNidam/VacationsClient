import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminPage from './components/AdminPage/AdminPage';
import { CardContainer } from './components/CardContainer/CardContainer';
import VacationModal from './components/EditVacation/VacationModal';
import LogInModal from './components/loginModal/LogInModal';
import Navbar from './components/navbar/navbar';
import RegisterModal from './components/RegisterModal/RegisterModal';
import { IUser } from './models/IUser';
import { ActionType } from './redux/action-type';
import jwt_decode from "jwt-decode";
import { UserType } from './models/UserType';
import { ISessionUserData } from './models/ISeasonData';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    initVacations();
    let sessionStorageDetails = sessionStorage.getItem("userDetails");
    if (sessionStorageDetails) {
      initUser(sessionStorageDetails);
    }
    else {
      const guestSocket = io('http://localhost:3002/', {}).connect();
      dispatch({ type: ActionType.GetGuestSocket, payload: guestSocket });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initVacations = async () => {
    try {
      const responseVacations = await axios.get("http://localhost:3001/vacations");
      let vacations = responseVacations.data;
      dispatch({ type: ActionType.GetAllVacationsArray, payload: vacations });
    }
    catch (e) {
      console.log(e);
      alert("Something went wrong, please try again later.");
    }
  }

  const initUser = async (sessionStorageDetails: string) => {
    try {
      let userDetails = JSON.parse(sessionStorageDetails);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + userDetails.token;
      const responseLikes = await axios.get("http://localhost:3001/likes");
      let likesArray = responseLikes.data;

      const socket = io('http://localhost:3002/', { query: { "token": userDetails.token } }).connect();

      let currentUser = convertDataToIUser(userDetails, likesArray, socket);
      dispatch({ type: ActionType.logInUser, payload: currentUser });
    }
    catch (e) {
      console.log(e);
      alert("Something went wrong, please try again later.");
    }
  }

  const convertDataToIUser = (userDetails: ISessionUserData, likesArray: Array<number>, socket: Socket<DefaultEventsMap, DefaultEventsMap>): IUser => {
    let token = userDetails.token;
    let tokenInfo: any = jwt_decode(token);
    let userFirstName = userDetails.firstName;
    let userLastName = userDetails.lastName;

    let typeOfUser = tokenInfo.typeOfUser;
    let userType: UserType = UserType.User;
    if (typeOfUser === "admin") {
      userType = UserType.Admin;
    }

    let likedVacations = new Set<number>();
    for (let like of likesArray) {
      likedVacations.add(like);
    }

    let currentUser: IUser = { firstName: userFirstName, lastName: userLastName, typeOfUser: userType, likedVacations: likedVacations, token: token, socket: socket };

    return currentUser;
  }

  return (
    <div className="App">
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path="/" element={<CardContainer />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<CardContainer />} />
        </Routes>
      </div>
      <LogInModal />
      <RegisterModal />
      <VacationModal />
    </div>
  );
}

export default App;
