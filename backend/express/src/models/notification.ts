import {IUser} from "./user.js";

export interface INotification {
    id: number;
    userId?: number;
    message: string;
    isRead?: boolean;
    createdAt?: Date;
    user?: IUser;
}

export class Notification implements INotification {
    id: number;
    userId?: number;
    message: string;
    isRead?: boolean;
    createdAt?: Date;
    user?: IUser;

    constructor(id: number, userId: number, message: string, createdAt: Date, user: IUser) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.createdAt = createdAt;
        this.user = user;
    }
}