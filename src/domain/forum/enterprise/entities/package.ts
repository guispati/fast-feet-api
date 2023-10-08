import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { PackageStatusChangedEvent } from "./events/package-status-changed-event";

export type StatusType = "created" | "waiting" | "withdrawn" | "delivered" | "returned";

export interface PackageProps {
    recipientId: UniqueEntityID;
    name: string;
    status: StatusType;
    postedAt: Date;
    pickedUpAt?: Date | null;
    delivererId?: UniqueEntityID | null;
    deliveredAt?: Date | null;
    attachmentId?: UniqueEntityID | null;
}

export class Package extends AggregateRoot<PackageProps> {
    get recipientId() {
        return this.props.recipientId;
    }

    set recipientId(recipientId: UniqueEntityID) {
        this.props.recipientId = recipientId;
    }

    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }

    get status() {
        return this.props.status;
    }

    set status(status: StatusType) {
        this.props.status = status;
        this.updateStatus();
    }

    public setStatusWithdrawn(delivererId: UniqueEntityID) {
        this.props.status = 'withdrawn';
        this.props.pickedUpAt = new Date();
        this.props.delivererId = delivererId;
        this.updateStatus();
    }

    public setStatusDelivered(attachmentId: UniqueEntityID) {
        this.props.status = 'delivered';
        this.props.deliveredAt = new Date();
        this.props.attachmentId = attachmentId;
        this.updateStatus();
    }

    get postedAt() {
        return this.props.postedAt;
    }

    get pickedUpAt() {
        return this.props.pickedUpAt;
    }

    get deliveredAt() {
        return this.props.deliveredAt;
    }

    get delivererId() {
        return this.props.delivererId;
    }

    get attachmentId() {
        return this.props.attachmentId;
    }

    private updateStatus() {
        this.addDomainEvent(new PackageStatusChangedEvent(this));
    }

    static create(
        props: Optional<PackageProps, 'postedAt' | 'pickedUpAt' | 'deliveredAt' | 'attachmentId' | 'delivererId' | 'status'>,
        id?: UniqueEntityID
    ) {
        const newPackage = new Package({
            ...props,
            status: props.status ?? 'created',
            postedAt: props.postedAt ?? new Date(),
        }, id);

        return newPackage;
    }
}