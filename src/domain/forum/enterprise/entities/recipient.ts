import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export interface RecipientProps {
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
}

export class Recipient extends AggregateRoot<RecipientProps> {
    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }

    static create(props: RecipientProps, id?: UniqueEntityID) {
        const newRecipient = new Recipient(props, id);

        return newRecipient;
    }
}