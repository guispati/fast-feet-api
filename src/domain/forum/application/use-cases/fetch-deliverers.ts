import { Either, right } from "@/core/either";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { Injectable } from "@nestjs/common";
import { Deliverer } from "../../enterprise/entities/deliverer";

type FetchDeliverersUseCaseResponse = Either<
    null,
    {
        deliverers: Deliverer[];
    }
>;

@Injectable()
export class FetchDeliverersUseCase {
    constructor(private deliverersRepository: DeliverersRepository) {}

    async execute(): Promise<FetchDeliverersUseCaseResponse> {
        const deliverers = await this.deliverersRepository.findMany();

        return right({
            deliverers,
        });
    }
}