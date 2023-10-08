import { faker } from '@faker-js/faker';

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Deliverer, DelivererProps } from '@/domain/forum/enterprise/entities/deliverer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaDelivererMapper } from '@/infra/database/prisma/mappers/prisma-deliverer-mapper';

export function makeDeliverer(
    override: Partial<DelivererProps> = {},
    id?: UniqueEntityID,
) {
    const deliverer = Deliverer.create(
        {
            delivererId: new UniqueEntityID(),
            name: faker.person.fullName(),
            cpf: faker.internet.ip(),
            password: faker.internet.password(),
            location: faker.location.city(),
            ...override,
        },
        id,
    );

    return deliverer;
}

@Injectable()
export class DelivererFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaDeliverer(data: Partial<DelivererProps> = {}): Promise<Deliverer> {
        const deliverer = makeDeliverer(data);

        await this.prisma.user.create({
            data: PrismaDelivererMapper.toPrisma(deliverer),
        });

        return deliverer;
    }
}