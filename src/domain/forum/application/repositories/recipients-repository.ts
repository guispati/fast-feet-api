import { Recipient } from "../../enterprise/entities/recipient";

export abstract class RecipientsRepository {
    abstract findById(id: string): Promise<Recipient | null>;
    abstract create(recipient: Recipient): Promise<void>;
    abstract findMany(): Promise<Recipient[]>;
    abstract findManyByCity(city: string): Promise<Recipient[]>;
    abstract save(recipient: Recipient): Promise<void>;
    abstract delete(recipient: Recipient): Promise<void>;
}