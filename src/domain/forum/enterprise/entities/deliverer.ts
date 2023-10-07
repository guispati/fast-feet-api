import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Optional } from "@/core/types/optional";

export interface DelivererProps extends UserProps {
    delivererId: UniqueEntityID;
}

export class Deliverer extends User<DelivererProps> {
    get delivererId() {
        return this.props.delivererId;
    }

    static create(props: Optional<DelivererProps, 'delivererId'>, id?: UniqueEntityID) {
        const deliverer = new Deliverer({
            ...props,
            delivererId: props.delivererId ?? new UniqueEntityID(),
        }, id);

        return deliverer;
    }
}