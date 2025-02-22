import {User} from "../models/user.js";
import {PaginatedUsers, UserPrismaService} from "../../prisma/user.js";

export class UserService {

    static async getAllUsers($limit: number, $skip: number, query?: any): Promise<PaginatedUsers | null> {
        return await UserPrismaService.getAllUsers($limit, $skip, query);
    }

    static async getUser(email: string): Promise<User | null> {
        return await UserPrismaService.getUser(email);
    }

    static async getUserById(id: number): Promise<User | null> {
        return await UserPrismaService.getUserById(id);
    }

    static async createUser(user: User): Promise<User> {
        return await UserPrismaService.createUser(user)
    }

    static async updateUser(id: number, user: Partial<User>): Promise<User> {
        return await UserPrismaService.updateUser(id, user)
    }

    static async deleteUser(id: number): Promise<void> {
        return await UserPrismaService.deleteUser(id);
    }

}