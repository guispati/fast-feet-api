import { PackagesRepository } from "@/domain/forum/application/repositories/packages-repository";
import { Package } from "@/domain/forum/enterprise/entities/package";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaPackageMapper } from "../mappers/prisma-package-mapper";
import { PrismaRecipientsRepository } from "./prisma-recipients-repository";

@Injectable()
export class PrismaPackagesRepository implements PackagesRepository {
    constructor(
        private prisma: PrismaService,
        private prismaRecipientsRepository: PrismaRecipientsRepository,
    ) {} 

    async findById(id: string) {
        const newPackage = await this.prisma.package.findUnique({
            where: {
                id,
            },
        });

        if (!newPackage) {
            return null;
        }

        return PrismaPackageMapper.toDomain(newPackage);
    }

    async create(newPackage: Package): Promise<void> {
        const data = PrismaPackageMapper.toPrisma(newPackage);

        await this.prisma.package.create({
            data,
        });
    }

    async findMany(): Promise<Package[]> {
        const packages = await this.prisma.package.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return packages.map(PrismaPackageMapper.toDomain);
    }

    async findManyByDelivererId(delivererId: string): Promise<Package[]> {
        const packages = await this.prisma.package.findMany({
            orderBy: {
                name: 'asc',
            },
            where: {
                delivererId,
            },
        });

        return packages.map(PrismaPackageMapper.toDomain);
    }

    async findManyNearbyLocation(location: string): Promise<Package[]> {
        const recipients = await this.prismaRecipientsRepository.findManyByCity(location);

        const filteredRecipientsId = recipients.map(recipient => recipient.id.toString());

        const packages = await this.prisma.package.findMany({
            orderBy: {
                name: 'asc',
            },
            where: {
                recipientId: {
                    in: filteredRecipientsId
                }
            },
        });

        return packages.map(PrismaPackageMapper.toDomain);
    }

    async save(newPackage: Package): Promise<void> {
        const data = PrismaPackageMapper.toPrisma(newPackage);

        await this.prisma.package.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

    async delete(newPackage: Package): Promise<void> {
        const data = PrismaPackageMapper.toPrisma(newPackage);

        await this.prisma.package.delete({
            where: {
                id: data.id,
            },
        });
    }
}