import { RecipientsRepository } from "@/domain/forum/application/repositories/recipients-repository";
import { Recipient } from "@/domain/forum/enterprise/entities/recipient";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
    constructor(private prisma: PrismaService) {} 

    async findById(id: string) {
        const recipient = await this.prisma.recipient.findUnique({
            where: {
                id,
            },
        });

        if (!recipient) {
            return null;
        }

        return PrismaRecipientMapper.toDomain(recipient);
    }

    async create(recipient: Recipient): Promise<void> {
        const data = PrismaRecipientMapper.toPrisma(recipient);

        await this.prisma.recipient.create({
            data,
        });
    }

    async findMany(): Promise<Recipient[]> {
        const recipients = await this.prisma.recipient.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return recipients.map(PrismaRecipientMapper.toDomain);
    }

    async findManyByCity(city: string): Promise<Recipient[]> {
        const recipients = await this.prisma.recipient.findMany({
            where: {
                city,
            },
        });

        return recipients.map(PrismaRecipientMapper.toDomain);
    }

    async save(recipient: Recipient): Promise<void> {
        const data = PrismaRecipientMapper.toPrisma(recipient);

        await this.prisma.recipient.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

    async delete(recipient: Recipient): Promise<void> {
        const data = PrismaRecipientMapper.toPrisma(recipient);

        await this.prisma.recipient.delete({
            where: {
                id: data.id,
            },
        });
    }
}