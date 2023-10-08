import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { RecipientsRepository } from "../repositories/recipients-repository";

interface CreateRecipientUseCaseRequest {
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
}

type CreateRecipientUseCaseResponse = Either<null, { recipient: Recipient }>;

@Injectable()
export class CreateRecipientUseCase {
    constructor(
        private recipientsRepository: RecipientsRepository,
    ) {}

    async execute({
        name,
        address,
        city,
        state,
        zipcode,
    }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
        const newRecipient = Recipient.create({
            name,
            address,
            city,
            state,
            zipcode,
        });

        await this.recipientsRepository.create(newRecipient);

        return right({
            recipient: newRecipient,
        });
    }
}