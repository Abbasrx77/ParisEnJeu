import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserPrismaService } from '../../prisma/user.js';
import { PrismaClient } from '@prisma/client';
import { user_role } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET;
    private static readonly SALT_LENGTH = 32;
    private static readonly KEY_LENGTH = 64;
    private static readonly TOKEN_EXPIRY = '1h';

    static generateSalt(): string {
        return crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    }

    static hashPassword(password: string, salt: string): string {
        return crypto.pbkdf2Sync(
            password,
            salt,
            1000,
            this.KEY_LENGTH,
            'sha512'
        ).toString('hex');
    }

    static generateToken(userId: number): string {
        return jwt.sign({ userId }, this.JWT_SECRET, {
            expiresIn: this.TOKEN_EXPIRY
        });
    }

    static async saveToken(user_id: number, token: string): Promise<void> {
        try {
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            await prisma.activeToken.create({
                data: {
                    token,
                    user_id,
                    expiresAt
                }
            });
        } catch (error) {
            throw new Error('Échec de la sauvegarde du token');
        }
    }

    static async register(userData: {
        email: string;
        password: string;
        nom: string;
        prenom: string;
        created_at: Date;
        role: user_role;
    }) {
        const existingUser = await UserPrismaService.getUser(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = this.generateSalt();
        const hash = this.hashPassword(userData.password, salt);

        const user = await UserPrismaService.createUser({
            email: userData.email,
            nom: userData.nom,
            prenom: userData.prenom,
            created_at: new Date(),
            role: userData.role,
            hash,
            salt
        });

        const token = this.generateToken(user.id);
        await this.saveToken(user.id, token);

        return {
            user,
            token
        };
    }

    static async login(email: string, password: string) {
        const user = await UserPrismaService.getUser(email);
        if (!user) {
            throw new Error('User not found');
        }

        const hash = this.hashPassword(password, user.salt);
        if (hash !== user.hash) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user.id);
        await this.saveToken(user.id, token);

        return {
            user,
            token
        };
    }

    static async verifyToken(token: string): Promise<{ userId: number }> {
        try {
            const activeToken = await prisma.activeToken.findUnique({
                where: { token }
            });

            if (!activeToken) {
                throw new Error('Token not found');
            }

            if (activeToken.expiresAt < new Date()) {
                await prisma.activeToken.delete({
                    where: { id: activeToken.id }
                });
                throw new Error('Token expired');
            }

            return jwt.verify(token, this.JWT_SECRET) as { userId: number };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static async logout(token: string): Promise<void> {
        await prisma.activeToken.delete({
            where: { token }
        });
    }

    static async cleanupExpiredTokens(): Promise<void> {
        const now = new Date();
        await prisma.activeToken.deleteMany({
            where: {
                expiresAt: {
                    lt: now
                }
            }
        });
    }
}