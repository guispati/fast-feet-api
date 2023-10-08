import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface MarkPackageAsDeliveredUseCaseRequest {
    packageId: string;
    attachmentId: string;
}

type MarkPackageAsDeliveredUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        package: Package;
    }
>;

@Injectable()
export class MarkPackageAsDeliveredUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
    ) {}

    async execute({
        packageId,
        attachmentId,
    }: MarkPackageAsDeliveredUseCaseRequest): Promise<MarkPackageAsDeliveredUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        newPackage.setStatusDelivered(new UniqueEntityID(attachmentId));

        await this.packagesRepository.save(newPackage);

        return right({
            package: newPackage,
        });
    }
}