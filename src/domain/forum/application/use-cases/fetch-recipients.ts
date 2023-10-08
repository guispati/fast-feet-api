import { Either, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";

type FetchRecipientsUseCaseResponse = Either<
    null,
    {
        recipients: Recipient[];
    }
>;

@Injectable()
export class FetchRecipientsUseCase {
    constructor(private recipientsRepository: RecipientsRepository) {}

    async execute(): Promise<FetchRecipientsUseCaseResponse> {
        const recipients = await this.recipientsRepository.findMany();

        return right({
            recipients,
        });
    }
}