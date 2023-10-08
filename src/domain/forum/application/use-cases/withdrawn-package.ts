import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface WithdrawnPackageUseCaseRequest {
    packageId: string;
    delivererId: string;
}

type WithdrawnPackageUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        package: Package;
    }
>;

@Injectable()
export class WithdrawnPackageUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
    ) {}

    async execute({
        packageId,
        delivererId,
    }: WithdrawnPackageUseCaseRequest): Promise<WithdrawnPackageUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        newPackage.setStatusWithdrawn(new UniqueEntityID(delivererId));

        await this.packagesRepository.save(newPackage);

        return right({
            package: newPackage,
        });
    }
}