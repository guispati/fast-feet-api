import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditRecipientUseCaseRequest {
    recipientId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
}

type EditRecipientUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        recipient: Recipient;
    }
>;

@Injectable()
export class EditRecipientUseCase {
    constructor(
        private recipientsRepository: RecipientsRepository,
    ) {}

    async execute({
        recipientId,
        name,
        address,
        city,
        state,
        zipcode,
    }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
        const newRecipient = await this.recipientsRepository.findById(recipientId);

        if (!newRecipient) {
            return left(new ResourceNotFoundError());
        }

        newRecipient.name = name;
        newRecipient.address = address;
        newRecipient.city = city;
        newRecipient.state = state;
        newRecipient.zipcode = zipcode;

        await this.recipientsRepository.save(newRecipient);

        return right({
            recipient: newRecipient,
        });
    }
}