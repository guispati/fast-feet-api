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

    get address() {
        return this.props.address;
    }

    set address(address: string) {
        this.props.address = address;
    }

    get city() {
        return this.props.city;
    }

    set city(city: string) {
        this.props.city = city;
    }

    get state() {
        return this.props.state;
    }

    set state(state: string) {
        this.props.state = state;
    }

    get zipcode() {
        return this.props.zipcode;
    }

    set zipcode(zipcode: string) {
        this.props.zipcode = zipcode;
    }

    static create(props: RecipientProps, id?: UniqueEntityID) {
        const newRecipient = new Recipient(props, id);

        return newRecipient;
    }
}