import {PrismaClient, reports} from "@prisma/client";

const prisma = new PrismaClient()

export type PaginatedReports = {
    total: number;
    limit: number;
    skip: number;
    data: reports[];
}

export class ReportPrismaService {

    static async getAllReports($limit: number, $skip: number,
        filters?: {
            category?: string;
            status?: string;
            startDate?: Date;
            endDate?: Date;
            searchQuery?: string;
        },
        sort?: string
    ): Promise<PaginatedReports> {

        const limit = isNaN(Number($limit)) ? 20 : Number($limit);
        const skip = isNaN(Number($skip)) ? 0 : Number($skip);

        // Construction de la clause WHERE
        let whereConditions: any = {};
        if (filters) {
            if (filters.category) {
                whereConditions.category = filters.category;
            }
            if (filters.status) {
                whereConditions.status = filters.status;
            }
            if (filters.startDate || filters.endDate) {
                whereConditions.created_at = {};
                if (filters.startDate) {
                    whereConditions.created_at.gte = filters.startDate;
                }
                if (filters.endDate) {
                    whereConditions.created_at.lte = filters.endDate;
                }
            }

            if (filters.searchQuery) {
                whereConditions.description = {
                    contains: filters.searchQuery,
                    mode: 'insensitive'
                };
            }
        }

        let orderBy: any = [];
        if (sort) {
            const sortFields = sort.split(',');
            for (const field of sortFields) {
                const trimmed = field.trim();
                if (trimmed.startsWith('-')) {
                    orderBy.push({ [trimmed.substring(1)]: 'desc' });
                } else {
                    orderBy.push({ [trimmed]: 'asc' });
                }
            }
        }

        const total = await prisma.reports.count({
            where: whereConditions,
        });

        const reportsData = await prisma.reports.findMany({
            skip: skip,
            take: limit,
            where: whereConditions,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
        });

        return {
            total: total,
            limit: limit,
            skip: skip,
            data: reportsData,
        };
    }


    static async getReportsNear(latitude: number, longitude: number, radius: number): Promise<reports[]> {
        return prisma.$queryRaw`
    SELECT * FROM reports
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${radius})`;
    }

    static async getReportsStatsByCategory(days?: number): Promise<{category: string; count: number}[]> {
        const whereClause = days ? {
            created_at: {
                gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
            }
        }:{}
        const stats = await prisma.reports.groupBy({
            by: ['category'],
            where: whereClause,
            _count: {
                category: true,
            },
        });
        return stats.map((stat) => ({
            category: stat.category,
            count: stat._count.category
        }))
    }

    static async getTimeSeriesReport(granularity: 'day' | 'week' | 'month' | 'year'): Promise<{period: Date; count: number}[]> {
        if (!['day', 'week', 'month', 'year'].includes(granularity)) {
            throw new Error(`Granularity ${granularity} is not supported. Must be day, week, month or year`);
        }

        const query = `
        SELECT date_trunc('${granularity}', created_at) AS period, COUNT(*) AS count 
        FROM reports
        GROUP BY period 
        ORDER BY period
        `
        return prisma.$queryRawUnsafe<{ period: Date, count: number }[]>(query);
    }

    static async getAverageResolutionTime(): Promise<{ avgResolutionTime: number | null, category: string }[]> {

        return prisma.$queryRaw`
            SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))) / 3600 AS "avgResolutionTime", category
            FROM reports
            WHERE status = 'resolu' 
            AND resolved_at IS NOT NULL
            GROUP BY category`;
    }

    

    static async getReportById(id: number): Promise<reports | null> {
        return prisma.reports.findUnique({
            where: { id }
        });
    }

    static async getUserReports(id: number): Promise<reports[] | null> {
        return prisma.reports.findMany({
            where: {
                user_id: id
            }
        })
    }

    static async createReport(report: Omit<reports, 'id'>): Promise<reports> {
        return prisma.reports.create({
            data: report
        });
    }

    static async updateReport(id: number, report: Partial<reports>): Promise<reports> {
        return prisma.reports.update({
            where: { id },
            data: report
        });
    }

    static async deleteReport(id: number): Promise<void> {
        await prisma.reports.delete({
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