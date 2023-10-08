import { User as PrismaDeliverer, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Deliverer } from '@/domain/forum/enterprise/entities/deliverer';

export class PrismaDelivererMapper {
    static toDomain(raw: PrismaDeliverer): Deliverer {
        return Deliverer.create(
            {
                name: raw.name,
                cpf: raw.cpf,
                password: raw.password,
                location: raw.location!,
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(deliverer: Deliverer): Prisma.UserUncheckedCreateInput {
        return {
            id: deliverer.delivererId.toString(),
            cpf: deliverer.cpf,
            name: deliverer.name,
            password: deliverer.password,
            location: deliverer.location,
            role: 'DELIVERER',
        }
    }
}