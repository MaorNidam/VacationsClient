import { Box, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { IVacation } from "../../models/IVacation";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";


export default function VacationModal() {

  const dispatch = useDispatch();

  const vacationMap = useSelector((state: AppState) => state.vacationMap);

  let vacationIdToEdit = useSelector((state: AppState) => state.vacationIdToEdit);

  let todayDate = new Date().toISOString().split('T')[0];

  let initVacationValue: IVacation = { id: 0, name: "", description: "", price: 0, imgURL: "", startDate: todayDate, endDate: "", amountOfLikes: 0 }

  let isModalShown = useSelector((state: AppState) => state.isVacationModalShown);

  let isEdit = (vacationIdToEdit !== 0);
  if (isEdit) {
    initVacationValue = vacationMap.get(vacationIdToEdit) as IVacation;
  }

  useEffect(() => {
    setNameValue(initVacationValue.name);
    setDescriptionValue(initVacationValue.description);
    setPriceValue(initVacationValue.price);
    setImgURLValue(initVacationValue.imgURL);
    setStartDateValue(initVacationValue.startDate);
    setEndDateValue(initVacationValue.endDate);
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [isModalShown])

  const [nameValue, setNameValue] = useState(initVacationValue.name);
  const [isNameError, setIsNameError] = useState(false);
  const [nameError, setNameError] = useState("");

  const [descriptionValue, setDescriptionValue] = useState(initVacationValue.description);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  const [priceValue, setPriceValue] = useState(initVacationValue.price);
  const [isPriceError, setIsPriceError] = useState(false);
  const [priceError, setPriceError] = useState("");

  const [imgURLValue, setImgURLValue] = useState(initVacationValue.imgURL);
  const [isImgURLError, setIsImgURLError] = useState(false);
  const [imgURLError, setImgURLError] = useState("");

  const [startDateValue, setStartDateValue] = useState(initVacationValue.startDate);
  const [isStartDateError, setIsStartDateError] = useState(false);
  const [startDateError, setStartDateError] = useState("");

  const [endDateValue, setEndDateValue] = useState(initVacationValue.endDate);
  const [isEndDateError, setIsEndDateError] = useState(false);
  const [endDateError, setEndDateError] = useState("");

  const getNameValue = (event: ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
    setIsNameError(false);
    setNameError("");
  }

  const getDescriptionValue = (event: ChangeEvent<HTMLInputElement>) => {
    setDescriptionValue(event.target.value);
    setIsDescriptionError(false);
    setDescriptionError("");
  }

  const getPriceValue = (event: ChangeEvent<HTMLInputElement>) => {
    setPriceValue(+event.target.value);
    setIsPriceError(false);
    setPriceError("");
  }

  const getImgURLValue = (event: ChangeEvent<HTMLInputElement>) => {
    setImgURLValue(event.target.value);
    setIsImgURLError(false);
    setImgURLError("");
  }

  const getStartDateValue = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDateValue(event.target.value);
    setEndDateValue("");
    setIsStartDateError(false);
    setStartDateError("");
  }

  const getEndDateValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDateValue(event.target.value);
    setIsEndDateError(false);
    setEndDateError("");
  }

  const hideModal = () => {
    cleanModalUI();
    cleanValues();
    dispatch({ type: ActionType.ToggleVacationModal, payload: 0 });
  }

  const handleAddOrEditVacation = async () => {
    let addedVacation: IVacation = {
      id: initVacationValue.id,
      name: nameValue,
      description: descriptionValue,
      price: +priceValue,
      imgURL: imgURLValue,
      startDate: startDateValue,
      endDate: endDateValue,
      amountOfLikes: initVacationValue.amountOfLikes
    }
    try {
      cleanModalUI();
      validateVacation(addedVacation);
      if (!isEdit) {
        await axios.post("http://localhost:3001/vacations", addedVacation);
      }
      else {
        await axios.put("http://localhost:3001/vacations", addedVacation);
      }
      hideModal();

    }
    catch (e: any) {
      // Alerting an error only if the it came from the server.
      if (e.message !== "ClientError") {
        alert("Something went wrong, please try again later.");
      }
      console.error(e);
    }
  }

  const validateVacation = (vacation: IVacation) => {
    let isErrorHappend = false;
    if (vacation.name === "") {
      setIsNameError(true);
      setNameError("Please enter vacation's name.");
      isErrorHappend = true;
    }

    if (vacation.name.length > 20) {
      setIsNameError(true);
      setNameError("Name is limited to 20 charecters.");
      isErrorHappend = true;
    }

    if (vacation.description === "") {
      setIsDescriptionError(true);
      setDescriptionError("Please describe the vacation.");
      isErrorHappend = true;
    }

    if (vacation.description.length > 1500) {
      setIsDescriptionError(true);
      setDescriptionError("Description is limited to 1500 charecters.");
      isErrorHappend = true;
    }

    if (vacation.price === 0) {
      setIsPriceError(true);
      setPriceError("Please enter a price.");
      isErrorHappend = true;
    }

    if (vacation.imgURL === "") {
      setIsImgURLError(true);
      setImgURLError("Please enter image URL.");
      isErrorHappend = true;
    }

    if (vacation.imgURL.length > 350) {
      setIsImgURLError(true);
      setImgURLError("Image URL is limited to 350 charecters.");
      isErrorHappend = true;
    }

    if (vacation.startDate === "") {
      setIsStartDateError(true);
      setStartDateError("Please enter a start date.");
      isErrorHappend = true;
    }

    if (vacation.endDate === "") {
      setIsEndDateError(true);
      setEndDateError("Invalid end date.");
      isErrorHappend = true;
    }

    if (vacation.startDate < todayDate) {
      setIsStartDateError(true);
      setStartDateError("Starting date can not be earlier then today.");
      isErrorHappend = true;
    }

    if (vacation.startDate > vacation.endDate) {
      setIsStartDateError(true);
      setIsEndDateError(true);
      setEndDateError("Value must be later the start date.");
    }

    if (isErrorHappend) {
      throw new Error("ClientError");
    }
  }

  const cleanModalUI = () => {
    setIsNameError(false);
    setNameError("");
    setIsDescriptionError(false);
    setDescriptionError("");
    setIsPriceError(false);
    setPriceError("");
    setIsImgURLError(false);
    setImgURLError("");
    setIsStartDateError(false);
    setStartDateError("");
    setIsEndDateError(false);
    setEndDateError("");
  }

  const cleanValues = () => {
    setNameValue("");
    setDescriptionValue("");
    setPriceValue(0);
    setImgURLValue("");
    setStartDateValue("");
    setEndDateValue("");
  }

  return (
    <Modal show={isModalShown} onHide={hideModal} contentClassName="modal-vacation">
      {!isEdit && <Modal.Header>Add Vacation</Modal.Header>}
      {isEdit && <Modal.Header>Edit Vacation</Modal.Header>}
      <Modal.Body>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            error={isNameError}
            helperText={nameError}
            onChange={getNameValue}
            defaultValue={initVacationValue.name}
            required
            fullWidth
            id="vacationName"
            label="Name"
            name="vacationName"
            autoFocus
          />
          <TextField
            margin="normal"
            error={isDescriptionError}
            helperText={descriptionError}
            onChange={getDescriptionValue}
            defaultValue={initVacationValue.description}
            required
            fullWidth
            id="desctiption"
            label="Desctiption"
            name="desctiption"
          />
          <TextField
            margin="normal"
            type="number"
            error={isPriceError}
            helperText={priceError}
            onChange={getPriceValue}
            defaultValue={(initVacationValue.price === 0) ? "" : initVacationValue.price}
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
          />
          <TextField
            margin="normal"
            error={isImgURLError}
            helperText={imgURLError}
            onChange={getImgURLValue}
            defaultValue={initVacationValue.imgURL}
            required
            fullWidth
            name="imgURL"
            label="Img URL"
            id="imgURL"
          />
          <TextField
            InputProps={{ inputProps: { min: todayDate } }}
            margin="normal"
            type="date"
            error={isStartDateError}
            helperText={startDateError}
            onChange={getStartDateValue}
            defaultValue={initVacationValue.startDate}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            name="startDate"
            label="Start Date"
            id="startDate"
          />
          <TextField
            InputProps={{ inputProps: { min: startDateValue } }}
            margin="normal"
            type="date"
            error={isEndDateError}
            helperText={endDateError}
            onChange={getEndDateValue}
            defaultValue={initVacationValue.endDate}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            name="endDate"
            label="End Date"
            id="endDate"
          />

          <br /> <br />
          <button
            className="btn btn-primary modal-button"
            onClick={handleAddOrEditVacation}
          >
            {!isEdit && "Add Vacation"}
            {isEdit && "Edit Vacation"}
          </button>

          <button
            className="btn btn-primary modal-button"
            onClick={hideModal}
          >
            Cancel
          </button>
          <br />
          <br />
        </Box>
      </Modal.Body>
    </Modal>
  );
}