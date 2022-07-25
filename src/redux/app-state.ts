import { IUser } from "../models/IUser";
import { IVacation } from "../models/IVacation";
import { UserType } from "../models/UserType";

export class AppState {

    public vacationMap: Map<number, IVacation> = new Map();

    public isLogInModalShown = false;
    public isRegisterModalShown = false;
    public isVacationModalShown = false;

    public vacationIdToEdit: number = 0;

    public registeredUserEmail: string = "";

    public guest: IUser = { id: 0, typeOfUser: UserType.Guest, firstName: "Guest", lastName: "", likedVacations: new Set<number>() } as IUser;
    public currentUser: IUser = this.guest as IUser;
}
