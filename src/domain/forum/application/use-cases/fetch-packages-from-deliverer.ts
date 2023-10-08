import { Either, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";

interface FetchPackagedFromDelivererUseCaseRequest {
    delivererId: string;
}

type FetchPackagedFromDelivererUseCaseResponse = Either<
    null,
    {
        packages: Package[];
    }
>;

@Injectable()
export class FetchPackagedFromDelivererUseCase {
    constructor(private packagesRepository: PackagesRepository) {}

    async execute({
        delivererId
    }: FetchPackagedFromDelivererUseCaseRequest): Promise<FetchPackagedFromDelivererUseCaseResponse> {
        const packages = await this.packagesRepository.findManyByDelivererId(delivererId);

        return right({
            packages,
        });
    }
}