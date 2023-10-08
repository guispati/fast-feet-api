import { Either, left, right } from "@/core/either";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Deliverer } from "../../enterprise/entities/deliverer";

interface EditDelivererUseCaseRequest {
    delivererId: string;
    name: string;
    cpf: string;
    location: string;
}

type EditDelivererUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        deliverer: Deliverer;
    }
>;

@Injectable()
export class EditDelivererUseCase {
    constructor(
        private deliverersRepository: DeliverersRepository,
    ) {}

    async execute({
        delivererId,
        name,
        cpf,
        location,
    }: EditDelivererUseCaseRequest): Promise<EditDelivererUseCaseResponse> {
        const deliverer = await this.deliverersRepository.findById(delivererId);

        if (!deliverer) {
            return left(new ResourceNotFoundError());
        }

        deliverer.name = name;
        deliverer.cpf = cpf;
        deliverer.location = location;

        await this.deliverersRepository.save(deliverer);

        return right({
            deliverer,
        });
    }
}