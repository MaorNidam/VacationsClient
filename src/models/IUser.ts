import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { UserType } from "./UserType"

export interface IUser {
    typeOfUser: UserType,
    firstName: string,
    lastName: string,
    likedVacations: Set<Number>
    token?: string
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>
}