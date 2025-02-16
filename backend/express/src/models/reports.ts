import {IUser} from "./user.js";

export enum ReportStatus {
    en_attente = 'en_attente',
    en_cours = 'en_cours',
    resolu = 'resolu',
}

export interface IReport {
    id: number;
    userId?: number;
    location?: Point;
    category: string;
    status?: ReportStatus;
    description?: string;
    photoUrls: string[];
    createdAt?: Date;
    arrondissement?: number;
    user?: IUser;
}

export class Report implements IReport {
    id: number;
    userId: number;
    location?: Point;
    category: string;
    status: ReportStatus;
    description?: string;
    photoUrls: string[];
    createdAt?: Date;
    arrondissement?: number;
    user?: IUser;

    constructor(id: number, userId: number, location: Point, category: string, status: ReportStatus, description: string, photoUrls: string[], createdAt: Date, arrondissement: number, user: IUser) {
        this.id = id;
        this.userId = userId;
        this.location = location;
        this.category = category;
        this.status = status;
        this.description = description;
        this.photoUrls = photoUrls;
        this.createdAt = createdAt;
        this.arrondissement = arrondissement;
        this.user = user;
    }
}
export type Point = { lat: number; lng: number };