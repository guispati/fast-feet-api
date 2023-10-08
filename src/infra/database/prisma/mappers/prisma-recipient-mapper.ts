import { Recipient as PrismaRecipient, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/forum/enterprise/entities/recipient';

export class PrismaRecipientMapper {
    static toDomain(raw: PrismaRecipient): Recipient {
        return Recipient.create(
            {
                name: raw.name,
                address: raw.address,
                city: raw.city,
                state: raw.state,
                zipcode: raw.zipcode,
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
        return {
            id: recipient.id.toString(),
            name: recipient.name,
            address: recipient.address,
            city: recipient.city,
            state: recipient.state,
            zipcode: recipient.zipcode,
        }
    }
}