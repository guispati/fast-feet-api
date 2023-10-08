import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Package, StatusType } from "../../enterprise/entities/package";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditPackageUseCaseRequest {
    packageId: string;
    name: string;
    recipientId: string;
    status: StatusType;
}

type EditPackageUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        package: Package;
    }
>;

@Injectable()
export class EditPackageUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
    ) {}

    async execute({
        packageId,
        name,
        status,
        recipientId,
    }: EditPackageUseCaseRequest): Promise<EditPackageUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        newPackage.name = name;
        newPackage.status = status;
        newPackage.recipientId = new UniqueEntityID(recipientId);

        await this.packagesRepository.save(newPackage);

        return right({
            package: newPackage,
        });
    }
}