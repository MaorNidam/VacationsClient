import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { IVacation } from "../../models/IVacation";
import { UserType } from "../../models/UserType";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./VacationCard.css"
import axios from "axios";

export interface IProps {
    vacation: IVacation
}

export function VacationCard(props: IProps) {
    let vacation = props.vacation;

    let currentUser = useSelector((state: AppState) => state.currentUser);

    let isAdmin = (currentUser.typeOfUser === UserType.Admin);

    let isUser = (currentUser.typeOfUser === UserType.User);

    const dispatch = useDispatch();

    const handleDeleteButton = async (vacationId: number) => {
        try {
            await axios.delete(`http://localhost:3001/vacations/${vacationId}`);
        }
        catch (e) {
            alert("Something went wrong, please try again later.");
            console.log(e);
        }
    }

    const handleLikeButton = async (vacationId: number) => {
        try {
            if (currentUser.likedVacations.has(vacationId)) {
                await axios.delete(`http://localhost:3001/likes/${vacationId}`);
            }
            else {
                await axios.post(`http://localhost:3001/likes`, { vacationId });
            }
            dispatch({ type: ActionType.handleLikeClicked, payload: vacationId });
        }
        catch (e) {
            alert("Something went wrong, please try again later.")
            console.log(e);
        }
    }

    const handleEditButton = (vacationId: number) => {
        dispatch({ type: ActionType.ToggleVacationModal, payload: vacationId });
    }

    let [isDescriptionModalShown, setIsDescriptionModalShown] = useState(false);
    const toggleDescritionModal = () => {
        setIsDescriptionModalShown(!isDescriptionModalShown);
    }

    const getLikeButtonValues = () => {
        if (currentUser.likedVacations.has(vacation.id)) {
            return { title: "Unlike Vacation", value: "❤️" };
        }
        else {
            return { title: "Like Vacation", value: "🖤" };
        }
    }

    const changeDateFormat = (date: string): string => {
        let vacationDate = date;
        let tempDateArray = vacationDate.split("-");
        let formatedDate = tempDateArray[2] + "/" + tempDateArray[1] + "/" + tempDateArray[0];
        return formatedDate;
    }

    let formatedStartDate = changeDateFormat(vacation.startDate);
    let formatedEndDate = changeDateFormat(vacation.endDate);

    let likeButton = getLikeButtonValues();

    return (
        <div className="vacation-card">
            <div className="followers">{vacation.amountOfLikes}</div>
            {isAdmin && <button title="Delete Vacation" className="btn card-button top-buttons" onClick={() => handleDeleteButton(vacation.id)}><DeleteIcon /></button>}
            {isAdmin && <button title="Edit Vacation" className="btn top-buttons card-button" onClick={() => handleEditButton(vacation.id)}><EditIcon /></button>}
            {isUser && <button title={likeButton.title} className="btn top-buttons card-button" onClick={() => handleLikeButton(vacation.id)}>{likeButton.value}</button>} <br />
            <div className="card-title">{vacation.name}

            </div>
            <div className="card-content">
                <img className="card-image" src={`${vacation.imgURL}`} alt="" /> <br />
                <div className="card-description">
                    {vacation.description}
                </div>
                <button className="btn btn-primary" onClick={() => toggleDescritionModal()}>Show More </button> <br />
                <Modal show={isDescriptionModalShown} onHide={() => toggleDescritionModal()} contentClassName="modal-vacation">
                    <Modal.Header><div className="modal-header-text">{vacation.name}</div><button type="button" className="btn-close" aria-label="Close" onClick={toggleDescritionModal}></button></Modal.Header>
                    <Modal.Body>{vacation.description}</Modal.Body>
                </Modal>
                Price: {vacation.price}$ <br />
                Start Date: {formatedStartDate} <br />
                End Date: {formatedEndDate} <br />
            </div>
        </div>
    );
}