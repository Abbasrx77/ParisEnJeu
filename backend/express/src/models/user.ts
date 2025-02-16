import {INotification} from "./notification.js";
import {IReport} from "./reports.js";
import {IUserBadge} from "./user_badge.js";

export enum UserRole {
    user = 'user',
    admin = 'admin',
}

export interface IUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    passwordHash: string;
    salt: string;
    createdAt?: Date;
    role?: UserRole;
    notifications: INotification[];
    reports: IReport[];
    userBadges: IUserBadge[];
    tokens: IActiveToken[];
}

export class User implements IUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    passwordHash: string;
    salt: string;
    createdAt?: Date;
    role?: UserRole;
    notifications: INotification[];
    reports: IReport[];
    userBadges: IUserBadge[];
    tokens: IActiveToken[];
    constructor(id: number, nom: string, prenom: string, email: string, passwordHash: string, salt: string, createdAt: Date, role: UserRole, notifications: INotification[], reports: IReport[], userBadges: IUserBadge[], tokens: IActiveToken[], )
    {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
        this.createdAt = createdAt;
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