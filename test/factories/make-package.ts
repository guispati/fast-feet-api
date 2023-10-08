import { faker } from '@faker-js/faker';

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Package, PackageProps } from '@/domain/forum/enterprise/entities/package';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPackageMapper } from '@/infra/database/prisma/mappers/prisma-package-mapper';

export function makePackage(
    override: Partial<PackageProps> = {},
    id?: UniqueEntityID,
) {
    const newPackage = Package.create(
        {
            recipientId: new UniqueEntityID(),
            name: faker.lorem.word(),
            
            ...override,
        },
        id,
    );

    return newPackage;
}

@Injectable()
export class PackageFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaPackage(data: Partial<PackageProps> = {}): Promise<Package> {
        const newPackage = makePackage(data);

        await this.prisma.package.create({
            data: PrismaPackageMapper.toPrisma(newPackage),
        });

        return newPackage;
    }
}