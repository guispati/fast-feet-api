import { faker } from '@faker-js/faker';

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from '@/domain/forum/enterprise/entities/recipient';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeRecipient(
    override: Partial<RecipientProps> = {},
    id?: UniqueEntityID,
) {
    const newRecipient = Recipient.create(
        {
            name: faker.lorem.word(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipcode: faker.location.zipCode(),
            
            ...override,
        },
        id,
    );

    return newRecipient;
}

// @Injectable()
// export class RecipientFactory {
//     constructor(private prisma: PrismaService) {}

//     async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
//         const recipient = makeRecipient(data);

//         await this.prisma.user.create({
//             data: PrismaRecipientMapper.toPrisma(recipient),
//         });

//         return recipient;
//     }
// }