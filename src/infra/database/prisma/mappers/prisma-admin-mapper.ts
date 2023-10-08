import { User as PrismaAdmin, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Admin } from '@/domain/forum/enterprise/entities/admin';

export class PrismaAdminMapper {
    static toDomain(raw: PrismaAdmin): Admin {
        return Admin.create(
            {
                name: raw.name,
                cpf: raw.cpf,
                password: raw.password,
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
        return {
            id: admin.adminId.toString(),
            cpf: admin.cpf,
            name: admin.name,
            password: admin.password,
            role: 'ADMIN',
        }
    }
}