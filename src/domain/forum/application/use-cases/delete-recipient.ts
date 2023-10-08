import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteRecipientUseCaseRequest {
    recipientId: string;
}

type DeleteRecipientUseCaseResponse = Either<
    ResourceNotFoundError,
    null
>;

@Injectable()
export class DeleteRecipientUseCase {
    constructor(private recipientsRepository: RecipientsRepository) {}

    async execute({
        recipientId,
    }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
        const newRecipient = await this.recipientsRepository.findById(recipientId);

        if (!newRecipient) {
            return left(new ResourceNotFoundError());
        }

        await this.recipientsRepository.delete(newRecipient);

        return right(null);
    }
}