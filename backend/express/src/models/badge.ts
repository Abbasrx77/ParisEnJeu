import {IUserBadge} from "./user.js";

export interface IBadge {
    id: number;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    userBadges: IUserBadge[];
}

export class Badge implements IBadge {
    id: number;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    userBadges: IUserBadge[];
    constructor(id: number, name: string, description: string | null, iconUrl: string | null, userBadges: IUserBadge[])
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.userBadges = userBadges;
    }
}