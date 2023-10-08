import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InvalidDelivererForPackageError } from "./errors/invalid-deliverer-for-package-error";
import { InvalidStatusToMarkPackageAsDeliveredError } from "./errors/invalid-status-to-mark-package-as-delivered-error";

interface MarkPackageAsDeliveredUseCaseRequest {
    packageId: string;
    delivererId: string;
    attachmentId: string;
}

type MarkPackageAsDeliveredUseCaseResponse = Either<
    ResourceNotFoundError | InvalidStatusToMarkPackageAsDeliveredError | InvalidDelivererForPackageError,
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
        delivererId,
        attachmentId,
    }: MarkPackageAsDeliveredUseCaseRequest): Promise<MarkPackageAsDeliveredUseCaseResponse> {
        const newPackage = await this.packagesRepository.findById(packageId);

        if (!newPackage) {
            return left(new ResourceNotFoundError());
        }

        if (newPackage.status !== 'withdrawn' || newPackage.delivererId === null) {
            return left(new InvalidStatusToMarkPackageAsDeliveredError());
        }

        if (newPackage.delivererId?.toString() !== delivererId) {
            return left(new InvalidDelivererForPackageError());
        }

        newPackage.setStatusDelivered(new UniqueEntityID(attachmentId));

        await this.packagesRepository.save(newPackage);

        return right({
            package: newPackage,
        });
    }
}