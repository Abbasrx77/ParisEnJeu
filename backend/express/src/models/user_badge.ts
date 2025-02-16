import {IUser} from "./user.js";
import {IBadge} from "./badge.js";

export interface IUserBadge {
    userId: number;
    badgeId: number;
    earnedAt?: Date;
    badge: IBadge;
    user: IUser;
}

export class UserBadge implements IUserBadge {
    userId: number;
    badgeId: number;
    earnedAt?: Date;
    badge: IBadge;
    user: IUser;
    constructor(userId: number, badgeId: number, earnedAt: Date, badge: IBadge, user: IUser)
    {
        this.userId = userId;
        this.badgeId = badgeId;
        this.earnedAt = earnedAt;
        this.badge = badge;
        this.user = user;
    }
}