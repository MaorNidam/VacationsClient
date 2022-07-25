import { Box, TextField, Grid } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import isEmailValid from "is-valid-email";
import "./LoginModal.css"
import { IUser } from "../../models/IUser";
import { UserType } from "../../models/UserType";
import jwt_decode from "jwt-decode";
import { ISessionUserData } from '../../models/ISeasonData';
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";



export default function LogInModal() {

  const dispatch = useDispatch();

  const currentUser = useSelector((state: AppState) => state.currentUser);

  const isShown = useSelector((state: AppState) => state.isLogInModalShown);

  const registeredEmail = useSelector((state: AppState) => state.registeredUserEmail);

  useEffect(() => {
    setEmailValue(registeredEmail);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown])

  const [emailValue, setEmailValue] = useState(registeredEmail);
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const getEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
    setIsEmailError(false);
    setEmailError("");

  }

  const getPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
    setIsPasswordError(false);
    setPasswordError("");
  }

  const hideModal = () => {
    cleanModalUI();
    cleanValues();
    dispatch({ type: ActionType.ToggleLogInModal });
  }

  const handleSubmitClicked = async () => {
    let userLogin = {
      email: emailValue,
      password: passwordValue
    }
    try {
      cleanModalUI();
      validateUser(userLogin.email as string, userLogin.password as string);
      let loginResponce = await axios.post("http://localhost:3001/users/login", userLogin);

      //Dissconnect guest socket.
      currentUser.socket?.disconnect();

      let token = loginResponce.data.token;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      let sessionStorageDetails: ISessionUserData = { token, firstName: loginResponce.data.firstName, lastName: loginResponce.data.lastName };
      let detailsJson = JSON.stringify(sessionStorageDetails)
      sessionStorage.setItem("userDetails", detailsJson);

      const socket = io('http://localhost:3002/', { query: { "token": token } }).connect(); // Client Socket Object.

      let loggedInUser = convertServerResponseToIUser(loginResponce, socket);
      dispatch({ type: ActionType.logInUser, payload: loggedInUser });
      hideModal();
    }
    catch (e: any) {
      if (e.message === "Request failed with status code 600") {
        setIsEmailError(true);
        setIsPasswordError(true);
        setPasswordError("Invalid e-mail or password.");
      }
      if (e.message !== "clientError" && e.message !== "Request failed with status code 600") {
        alert("Something went wrong, please try again later.")
      }
      console.log(e);
    }
  }

  const convertServerResponseToIUser = (loginResponce: AxiosResponse<any, any>, socket: Socket<DefaultEventsMap, DefaultEventsMap>): IUser => {
    let token = loginResponce.data.token;
    let tokenInfo: any = jwt_decode(token);
    let userFirstName = loginResponce.data.firstName;
    let userLastName = loginResponce.data.lastName;

    let typeOfUser = tokenInfo.typeOfUser;
    let userType: UserType = UserType.User;
    if (typeOfUser === "admin") {
      userType = UserType.Admin;
    }

    let likesArray = loginResponce.data.likesArray;

    let likedVacations = new Set<number>();
    for (let like of likesArray) {
      likedVacations.add(like);
    }

    let currentUser: IUser = { firstName: userFirstName, lastName: userLastName, typeOfUser: userType, likedVacations: likedVacations, token: token, socket: socket };

    return currentUser;
  }

  const validateUser = (email: string, password: string) => {
    if (!isEmailValid(email)) {
      setIsEmailError(true);
      setIsPasswordError(true);
      setEmailError("Invalid E-mail.");
      throw new Error("clientError");
    }

    if (email === "") {
      setIsEmailError(true);
      setIsPasswordError(true);
      setEmailError("Please enter your E-mail.");
      throw new Error("clientError");
    }

    if (password === "") {
      setIsPasswordError(true);
      setPasswordError("Please enter your password.");
      throw new Error("clientError");
    }
  }

  const handleRegisterClicked = () => {
    hideModal();
    cleanValues();
    dispatch({ type: ActionType.ToggleRegisterModal });
  }

  const cleanModalUI = () => {
    setIsEmailError(false);
    setEmailError("");
    setIsPasswordError(false);
    setPasswordError("");
  }

  const cleanValues = () => {
    setEmailValue("");
    setPasswordValue("");
  }

  return (
    <Modal show={isShown} onHide={hideModal} contentClassName="modal-vacation">
      <Modal.Header>Log In</Modal.Header>
      <Modal.Body>
        <Box sx={{ mt: 1 }}>
          admin : admin@admin.com <br />
          password: 123456 <br />
          user : or@gmail.com <br />
          password: 123456 <br />
          <TextField
            margin="normal"
            error={isEmailError}
            helperText={emailError}
            onChange={getEmailValue}
            defaultValue={registeredEmail}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            error={isPasswordError}
            helperText={passwordError}
            onChange={getPasswordValue}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <br /> <br />
          <button
            className="btn btn-primary modal-button"
            onClick={handleSubmitClicked}
          >
            Log In
          </button>
          <button
            className="btn btn-primary modal-button"
            onClick={hideModal}
          >
            Cancel
          </button>
          <br /> <br />
          <Grid container>
            <Grid item>
              <button className="btn" onClick={handleRegisterClicked}>
                {"Don't have an account? Sign Up"}
              </button>
            </Grid>
          </Grid>
        </Box>
      </Modal.Body>
    </Modal>
  );
}