import {PrismaClient, users} from "@prisma/client";
const prisma = new PrismaClient()

export type PaginatedUsers = {
    total: number;
    limit: number;
    skip: number;
    data: users[];
}

export class UserPrismaService {

    static async getAllUsers($limit: number, $skip: number, query?: any): Promise<PaginatedUsers> {
        const limit = isNaN(Number($limit)) ? 20 : Number($limit);
        const skip = isNaN(Number($skip)) ? 0 : Number($skip);

        const total = await prisma.users.count();
        const users = await prisma.users.findMany({
            skip: skip,
            take: limit,
            where: {
                OR: query.length > 0 ? query : undefined,
            },
        });

        return {
            total: total,
            limit: limit,
            skip: skip,
            data: users
        };
    }

    static async getUser(email: string): Promise<users | null> {
        return prisma.users.findUnique({
            where: { email }
        });
    }

    static async getUserById(id: number): Promise<users | null> {
        return prisma.users.findUnique({
            where: { id }
        });
    }

    static async createUser(user: Omit<users, 'id'>): Promise<users> {
        return prisma.users.create({
            data: user
        });
    }

    static async updateUser(id: number, user: Partial<users>): Promise<users> {
        return prisma.users.update({
            where: { id },
            data: user
        });
    }

    static async deleteUser(id: number): Promise<void> {
        await prisma.users.delete({
            where: { id }
        });
    }
}
async function main() {

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e);
        prisma.$disconnect()
    })