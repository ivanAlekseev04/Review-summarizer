import prisma from '../repository/prisma';
import dayjs from 'dayjs';

export const summaryRepository = {
    async getReviewsSummaryByProductId(
        productId: number
    ): Promise<string | null> {
        const summary = await prisma.summary.findFirst({
            where: {
                AND: [{ productId }, { expiresAt: { gt: new Date() } }], // WHERE expiresAt > now()
            },
        });

        return summary ? summary.content : null;
    },

    async persistReviewSummary(productId: number, summary: string) {
        const now = new Date();
        const expiresAt = dayjs().add(7, 'days').toDate();
        const data = {
            content: summary,
            productId,
            generatedAt: now,
            expiresAt,
        };

        return prisma.summary.upsert({
            where: { productId },
            create: data,
            update: data,
        });
    },
};
