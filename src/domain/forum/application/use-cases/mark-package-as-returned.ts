import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";

interface MarkPackageAsReturnedUseCaseRequest {
    packageId: string;
}

type MarkPackageAsReturnedUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        package: Package;
    }
>;

@Injectable()
export class MarkPackageAsReturnedUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
    ) {}

    async execute({
        packageId,
    }: MarkPackageAsReturnedUseCaseRequest): Promise<MarkPackageAsReturnedUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        newPackage.status = 'returned';

        await this.packagesRepository.save(newPackage);

        return right({
            package: newPackage,
        });
    }
}