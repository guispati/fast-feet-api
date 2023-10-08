import { DeliverersRepository } from "@/domain/forum/application/repositories/deliverers-repository";
import { Deliverer } from "@/domain/forum/enterprise/entities/deliverer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaDelivererMapper } from "../mappers/prisma-deliverer-mapper";

@Injectable()
export class PrismaDeliverersRepository implements DeliverersRepository {
    constructor(private prisma: PrismaService) {} 

    async findByCpf(cpf: string) {
        const deliverer = await this.prisma.user.findUnique({
            where: {
                cpf,
                role: "DELIVERER",
            },
        });

        if (!deliverer) {
            return null;
        }

        return PrismaDelivererMapper.toDomain(deliverer);
    }

    async findById(id: string) {
        const deliverer = await this.prisma.user.findUnique({
            where: {
                id,
                role: "DELIVERER",
            },
        });

        if (!deliverer) {
            return null;
        }

        return PrismaDelivererMapper.toDomain(deliverer);
    }

    async create(deliverer: Deliverer): Promise<void> {
        const data = PrismaDelivererMapper.toPrisma(deliverer);

        await this.prisma.user.create({
            data,
        });
    }

    async findMany(): Promise<Deliverer[]> {
        const deliverers = await this.prisma.user.findMany({
            where: {
                role: 'DELIVERER',
            },
            orderBy: {
                name: 'asc',
            },
        });

        return deliverers.map(PrismaDelivererMapper.toDomain);
    }

    async save(deliverer: Deliverer): Promise<void> {
        const data = PrismaDelivererMapper.toPrisma(deliverer);

        await this.prisma.user.update({
            where: {
                role: 'DELIVERER',
                id: data.id,
            },
            data,
        });
    }

    async delete(deliverer: Deliverer): Promise<void> {
        const data = PrismaDelivererMapper.toPrisma(deliverer);

        await this.prisma.user.delete({
            where: {
                role: 'DELIVERER',
                id: data.id,
            },
        });
    }
}