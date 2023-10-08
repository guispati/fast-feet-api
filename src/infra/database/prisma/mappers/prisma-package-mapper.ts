import { Package as PrismaPackage, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Package } from '@/domain/forum/enterprise/entities/package';

export class PrismaPackageMapper {
    static toDomain(raw: PrismaPackage): Package {
        return Package.create(
            {
                name: raw.name,
                recipientId: new UniqueEntityID(raw.recipientId),
                status: raw.status,
                postedAt: raw.postedAt,
                deliveredAt: raw.deliveredAt,
                pickedUpAt: raw.pickedUpAt,
                attachmentId: raw.attachmentId ? new UniqueEntityID(raw.attachmentId) : null,
                delivererId: raw.delivererId ? new UniqueEntityID(raw.delivererId) : null,
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(newPackage: Package): Prisma.PackageUncheckedCreateInput {
        return {
            id: newPackage.id.toString(),
            name: newPackage.name,
            recipientId: newPackage.recipientId.toString(),
            status: newPackage.status,
            postedAt: newPackage.postedAt,
            deliveredAt: newPackage.deliveredAt,
            pickedUpAt: newPackage.pickedUpAt,
            attachmentId: newPackage.attachmentId?.toString(),
            delivererId: newPackage.delivererId?.toString(),
        }
    }
}