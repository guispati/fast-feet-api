import { Either, left, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface FetchPackagesNearbyDelivererLocationUseCaseRequest {
    delivererId: string;
}

type FetchPackagesNearbyDelivererLocationUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        packages: Package[];
    }
>;

@Injectable()
export class FetchPackagesNearbyDelivererLocationUseCase {
    constructor(
        private packagesRepository: PackagesRepository,
        private deliverersRepository: DeliverersRepository,
    ) {}

    async execute({
        delivererId
    }: FetchPackagesNearbyDelivererLocationUseCaseRequest): Promise<FetchPackagesNearbyDelivererLocationUseCaseResponse> {
        const deliverer = await this.deliverersRepository.findById(delivererId);

        if (!deliverer?.location) {
            return left(new ResourceNotFoundError());
        }

        const packages = await this.packagesRepository.findManyNearbyLocation(deliverer.location);

        return right({
            packages,
        });
    }
}