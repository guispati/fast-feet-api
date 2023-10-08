import { Either, right } from "@/core/either";
import { PackagesRepository } from "../repositories/packages-repository";
import { Injectable } from "@nestjs/common";
import { Package } from "../../enterprise/entities/package";

type FetchPackagesUseCaseResponse = Either<
    null,
    {
        packages: Package[];
    }
>;

@Injectable()
export class FetchPackagesUseCase {
    constructor(private packagesRepository: PackagesRepository) {}

    async execute(): Promise<FetchPackagesUseCaseResponse> {
        const packages = await this.packagesRepository.findMany();

        return right({
            packages,
        });
    }
}