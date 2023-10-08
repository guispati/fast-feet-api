import { Either, left, right } from "@/core/either";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Deliverer } from "../../enterprise/entities/deliverer";
import { HashGenerator } from "../cryptography/hash-generator";

interface EditDelivererPasswordUseCaseRequest {
    delivererId: string;
    password: string;
}

type EditDelivererPasswordUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        deliverer: Deliverer;
    }
>;

@Injectable()
export class EditDelivererPasswordUseCase {
    constructor(
        private deliverersRepository: DeliverersRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        delivererId,
        password,
    }: EditDelivererPasswordUseCaseRequest): Promise<EditDelivererPasswordUseCaseResponse> {
        const deliverer = await this.deliverersRepository.findById(delivererId);

        if (!deliverer) {
            return left(new ResourceNotFoundError());
        }

        const hashedPassword = await this.hashGenerator.hash(password);

        deliverer.password = hashedPassword;

        await this.deliverersRepository.save(deliverer);

        return right({
            deliverer,
        });
    }
}