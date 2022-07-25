
import { useSelector } from "react-redux";
import { IVacation } from "../../models/IVacation";
import { AppState } from "../../redux/app-state";
import { VacationCard } from "../VacationCard/VacationCard"
import "./CardContainer.css"

export function CardContainer() {

    let vacationMap = useSelector((state: AppState) => state.vacationMap);

    let currentUser = useSelector((state: AppState) => state.currentUser);

    // Making a new array for vacation ID, to display the vacations map by the current user choosen vacations.
    let currentUserViewVacationArray: number[] = [];

    vacationMap.forEach((vacation) => {
        currentUserViewVacationArray.push(vacation.id);
    });

    currentUserViewVacationArray.sort((vacationIdA, vacationIdB) => {
        if (currentUser.likedVacations.has(vacationIdA) === currentUser.likedVacations.has(vacationIdB)) {
            return 0;
        }
        if (currentUser.likedVacations.has(vacationIdA)) {
            return -1;
        }
        return 1;
    });

    return (
        <div className="container card-container">
            {currentUserViewVacationArray.map((vacationId: number) => {
                let vacation: IVacation = vacationMap.get(vacationId) as IVacation;
                return <VacationCard key={vacationId} vacation={vacation} />
            })}
        </div>
    )
}