import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";
import { IVacation } from "../models/IVacation";
import { IUser } from "../models/IUser";


const initialAppStateValue = new AppState();
export function reduce(oldAppState: AppState = initialAppStateValue, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.GetAllVacationsArray:
            let vacationArray = action.payload;
            let tempVacationMap = new Map<number, IVacation>();
            for (let vacation of vacationArray) {
                tempVacationMap.set(vacation.id, vacation);
            }
            newAppState.vacationMap = tempVacationMap;
            break;

        case ActionType.DeleteCard:
            let vacationID: number = +action.payload;

            let tempMapForDelete = new Map(newAppState.vacationMap);
            tempMapForDelete.delete(vacationID);

            newAppState.vacationMap = tempMapForDelete;
            break;

        case ActionType.handleLikeClicked:
            let vacationId: number = action.payload;
            let vacation = newAppState.vacationMap.get(vacationId) as IVacation;

            let currentUser = { ...newAppState.currentUser }
            let isFollowing: Boolean = currentUser.likedVacations.has(vacationId);

            if (isFollowing) {
                vacation.amountOfLikes--;
                currentUser.likedVacations.delete(vacationId);
            }
            else {
                vacation.amountOfLikes++;
                currentUser.likedVacations.add(vacationId);
            }
            newAppState.currentUser = currentUser;
            break;

        case ActionType.handleLogOut:
            newAppState.currentUser = { ...newAppState.guest } as IUser;
            break;

        case ActionType.ToggleLogInModal:
            if (action.payload !== undefined) {
                newAppState.registeredUserEmail = action.payload;
            }
            else {
                newAppState.registeredUserEmail = "";
            }
            newAppState.isLogInModalShown = !newAppState.isLogInModalShown;
            break;

        case ActionType.ToggleRegisterModal:
            newAppState.isRegisterModalShown = !newAppState.isRegisterModalShown;
            break;

        case ActionType.ToggleVacationModal:
            if (action.payload !== undefined) {
                newAppState.vacationIdToEdit = action.payload;
            }
            newAppState.isVacationModalShown = !newAppState.isVacationModalShown;
            break;

        case ActionType.logInUser:
            let loggedInUser = action.payload;
            newAppState.currentUser = loggedInUser;
            break;

        case ActionType.addOrEditVacation:
            let addedVacation = action.payload;
            let tempMapForAddOrEdit = new Map(newAppState.vacationMap);
            tempMapForAddOrEdit.set(addedVacation.id, addedVacation);
            newAppState.vacationMap = tempMapForAddOrEdit;
            break;

        case ActionType.GetGuestSocket:
            newAppState.guest.socket = action.payload;
            newAppState.currentUser = { ...newAppState.guest };
            break;
    }

    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}

