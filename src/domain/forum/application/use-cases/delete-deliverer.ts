import { Either, left, right } from "@/core/either";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteDelivererUseCaseRequest {
    delivererId: string;
}

type DeleteDelivererUseCaseResponse = Either<
    ResourceNotFoundError,
    null
>;

@Injectable()
export class DeleteDelivererUseCase {
    constructor(private deliverersRepository: DeliverersRepository) {}

    async execute({
        delivererId,
    }: DeleteDelivererUseCaseRequest): Promise<DeleteDelivererUseCaseResponse> {
        const deliverer = await this.deliverersRepository.findById(delivererId);

        if (!deliverer) {
            return left(new ResourceNotFoundError());
        }

        await this.deliverersRepository.delete(deliverer);

        return right(null);
    }
}