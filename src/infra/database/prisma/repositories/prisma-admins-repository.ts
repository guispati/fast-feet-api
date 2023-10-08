import { AdminsRepository } from "@/domain/forum/application/repositories/admins-repository";
import { Admin } from "@/domain/forum/enterprise/entities/admin";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
    constructor(private prisma: PrismaService) {} 

    async findByCpf(cpf: string) {
        const admin = await this.prisma.user.findUnique({
            where: {
                cpf,
                role: "ADMIN",
            },
        });

        if (!admin) {
            return null;
        }

        return PrismaAdminMapper.toDomain(admin);
    }

    async findById(id: string) {
        const admin = await this.prisma.user.findUnique({
            where: {
                id,
                role: "ADMIN",
            },
        });

        if (!admin) {
            return null;
        }

        return PrismaAdminMapper.toDomain(admin);
    }

    async create(admin: Admin): Promise<void> {
        const data = PrismaAdminMapper.toPrisma(admin);

        await this.prisma.user.create({
            data,
        });
    }

    async findMany(): Promise<Admin[]> {
        const admins = await this.prisma.user.findMany({
            where: {
                role: 'ADMIN',
            },
            orderBy: {
                name: 'asc',
            },
        });

        return admins.map(PrismaAdminMapper.toDomain);
    }

    async save(admin: Admin): Promise<void> {
        const data = PrismaAdminMapper.toPrisma(admin);

        await this.prisma.user.update({
            where: {
                role: 'ADMIN',
                id: data.id,
            },
            data,
        });
    }

    async delete(admin: Admin): Promise<void> {
        const data = PrismaAdminMapper.toPrisma(admin);

        await this.prisma.user.delete({
            where: {
                role: 'ADMIN',
                id: data.id,
            },
        });
    }
}