import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeletePackageUseCaseRequest {
    packageId: string;
}

type DeletePackageUseCaseResponse = Either<
    ResourceNotFoundError,
    null
>;

@Injectable()
export class DeletePackageUseCase {
    constructor(private packagesRepository: PackagesRepository) {}

    async execute({
        packageId,
    }: DeletePackageUseCaseRequest): Promise<DeletePackageUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        await this.packagesRepository.delete(newPackage);

        return right(null);
    }
}