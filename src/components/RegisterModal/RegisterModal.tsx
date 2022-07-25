import { Box, Grid, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import isEmailValid from "is-valid-email";

interface IRegister {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  typeOfUser: string,
  verifyPassword: string
}

export default function RegisterModal() {

  const dispatch = useDispatch();

  const isShown = useSelector((state: AppState) => state.isRegisterModalShown);

  const [emailValue, setEmailValue] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [firstNameValue, setFirstNameValue] = useState("");
  const [isFirstNameError, setIsFirstNameError] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");

  const [lastNameValue, setLastNameValue] = useState("");
  const [isLastNameError, setIsLastNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [verifyPasswordValue, setVerifyPasswordValue] = useState("");
  const [isVerifyPasswordError, setIsVerifyPasswordError] = useState(false);
  const [verifyPasswordError, setVerifyPasswordError] = useState("");


  const getEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
    setIsEmailError(false);
    setEmailError("");
  }

  const getFirstNameValue = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstNameValue(event.target.value);
    setIsFirstNameError(false);
    setFirstNameError("");
  }

  const getLastNameValue = (event: ChangeEvent<HTMLInputElement>) => {
    setLastNameValue(event.target.value);
    setIsLastNameError(false);
    setLastNameError("");
  }

  const getPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
    setIsPasswordError(false);
    setPasswordError("");
  }

  const getVerifyPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyPasswordValue(event.target.value);
    setIsVerifyPasswordError(false);
    setVerifyPasswordError("");
  }

  const hideModal = () => {
    cleanModalUI();
    cleanValues();
    dispatch({ type: ActionType.ToggleRegisterModal });
  }

  const handleSubmit = async () => {
    let userRegister: IRegister = {
      email: emailValue,
      firstName: firstNameValue,
      lastName: lastNameValue,
      typeOfUser: "user",
      password: passwordValue,
      verifyPassword: verifyPasswordValue
    }

    try {
      cleanModalUI();
      validateUserRegister(userRegister);
      await axios.post("http://localhost:3001/users", userRegister);
      hideModal();
      alert(`Welcome ${userRegister.firstName} ${userRegister.lastName}`)
      dispatch({ type: ActionType.ToggleLogInModal, payload: userRegister.email });

    }
    catch (e: any) {
      if (e.message === "Request failed with status code 600") {
        setIsEmailError(true);
        setEmailError("E-mail already exist.");
      }
      if (e.message !== "clientError" && e.message !== "Request failed with status code 600") {
        alert("Something went wrong, please try again later.")
      }
      console.log(e);
    }
  }

  const validateUserRegister = (userRegister: IRegister) => {
    let isErrorHappend = false;
    if (userRegister.email === "") {
      setIsEmailError(true);
      setEmailError("Please enter your E-mail.");
      isErrorHappend = true;
    }
    else {
      if (!isEmailValid(userRegister.email)) {
        setIsEmailError(true);
        setIsPasswordError(true);
        setEmailError("Invalid E-mail.");
      }
    }

    if (userRegister.firstName === "") {
      setIsFirstNameError(true);
      setFirstNameError("Please enter your first name.");
      isErrorHappend = true;
    }
    let format = /[^a-zA-Z]/g;
    if (format.test(userRegister.firstName)) {
      setIsFirstNameError(true);
      setFirstNameError("First name must be one word and contain only letters.");
      isErrorHappend = true;
    }

    if (userRegister.password.length < 6 || userRegister.password.length > 12) {
      setIsPasswordError(true);
      setPasswordError("Password must contain between 6 to 12 charecters.");
      isErrorHappend = true;
    }

    if (userRegister.verifyPassword === "") {
      setIsVerifyPasswordError(true);
      setVerifyPasswordError("Please verify your password.");
      isErrorHappend = true;
    }

    if (userRegister.password !== userRegister.verifyPassword) {
      setIsPasswordError(true);
      setIsVerifyPasswordError(true)
      setVerifyPasswordError("Password doesn't match.");
      isErrorHappend = true;
    }

    if (isErrorHappend) {
      throw new Error("clientError");
    }
  }

  const cleanModalUI = () => {
    setIsEmailError(false);
    setEmailError("");
    setIsFirstNameError(false);
    setFirstNameError("");
    setIsLastNameError(false);
    setLastNameError("");
    setIsPasswordError(false);
    setPasswordError("");
    setIsVerifyPasswordError(false);
    setVerifyPasswordError("");
  }

  const cleanValues = () => {
    setEmailValue("");
    setFirstNameValue("");
    setLastNameValue("");
    setPasswordValue("");
    setVerifyPasswordValue("");
  }


  const handleLoginClicked = () => {
    hideModal();
    dispatch({ type: ActionType.ToggleLogInModal })
  }

  return (
    <Modal show={isShown} onHide={hideModal} contentClassName="modal-vacation">
      <Modal.Header>Register</Modal.Header>
      <Modal.Body>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            error={isEmailError}
            helperText={emailError}
            onChange={getEmailValue}
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
            error={isFirstNameError}
            helperText={firstNameError}
            onChange={getFirstNameValue}
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
          />
          <TextField
            margin="normal"
            error={isLastNameError}
            helperText={lastNameError}
            onChange={getLastNameValue}
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
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
          <TextField
            margin="normal"
            error={isVerifyPasswordError}
            helperText={verifyPasswordError}
            onChange={getVerifyPasswordValue}
            required
            fullWidth
            name="verifyPassword"
            label="Verify Password"
            type="password"
            id="verifyPassword"
            autoComplete="current-password"
          />
          <PasswordStrengthBar password={passwordValue} />
          <br /> <br />
          <button
            className="btn btn-primary modal-button"
            onClick={handleSubmit}
          >
            Register
          </button>
          <button
            className="btn btn-primary modal-button"
            onClick={hideModal}
          >
            Cancel
          </button>
          <br />
          <br />
          <Grid container>
            <Grid item>
              <button className="btn" onClick={handleLoginClicked}>
                {"Have an account? Log in."}
              </button>
            </Grid>
          </Grid>
        </Box>
      </Modal.Body>
    </Modal>
  );
}