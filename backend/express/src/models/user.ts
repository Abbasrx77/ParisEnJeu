import {INotification} from "./notification.js";
import {IReport} from "./reports.js";
import {IUserBadge} from "./user_badge.js";
import { user_role } from '@prisma/client';


export interface IUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    hash: string;
    salt: string;
    created_at: Date;
    role: user_role;
    notifications?: INotification[];
    reports?: IReport[];
    userBadges?: IUserBadge[];
    tokens?: IActiveToken[];
}

type UserPassword = {
    password: string
}

export type UserDetails = IUser & UserPassword

export class User implements IUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    hash: string;
    salt: string;
    created_at: Date;
    role: user_role;
    notifications?: INotification[];
    reports?: IReport[];
    userBadges?: IUserBadge[];
    tokens?: IActiveToken[];
    constructor(id: number, nom: string, prenom: string, email: string, hash: string, salt: string, created_at: Date, role: user_role, notifications: INotification[] = [], reports: IReport[] = [], userBadges: IUserBadge[] = [], tokens: IActiveToken[] = [] )
    {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.hash = hash;
        this.salt = salt;
        this.created_at = created_at;
        this.role = role;
        this.notifications = notifications;
        this.reports = reports;
        this.userBadges = userBadges;
        this.tokens = tokens;
    }
}

export interface IActiveToken {
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
    user: IUser;
}