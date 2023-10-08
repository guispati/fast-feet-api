import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";
import { PackagesRepository } from "../repositories/packages-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreatePackageUseCaseRequest {
    name: string;
    recipientId: string;
}

type CreatePackageUseCaseResponse = Either<null, { package: Package }>;

@Injectable()
export class CreatePackageUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
    ) {}

    async execute({
        name,
        recipientId
    }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
        const newPackage = Package.create({
            name,
            recipientId: new UniqueEntityID(recipientId),
        });

        await this.packagesRepository.create(newPackage);

        return right({
            package: newPackage,
        });
    }
}