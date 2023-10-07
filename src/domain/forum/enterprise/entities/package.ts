import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { PackageStatusChangedEvent } from "./events/package-status-changed-event";

export type StatusType = "waiting" | "withdrawn" | "delivered";

export interface PackageProps {
    recipientId: UniqueEntityID;
    name: string;
    status: StatusType;
    postedAt: Date;
    pickedUpAt?: Date | null;
    deliveredAt?: Date | null;
    attachmentId?: UniqueEntityID | null;
}

export class Package extends AggregateRoot<PackageProps> {
    get recipientId() {
        return this.props.recipientId;
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

    get postedAt() {
        return this.props.postedAt;
    }

    get pickedUpAt() {
        return this.props.pickedUpAt;
    }

    get deliveredAt() {
        return this.props.deliveredAt;
    }

    private updateStatus() {
        switch(this.props.status) {
            case 'withdrawn':
                this.props.pickedUpAt = new Date();
            break;

            case 'delivered':
                this.props.deliveredAt = new Date();
            break;
        }

        this.addDomainEvent(new PackageStatusChangedEvent(this));
    }

    get attachment() {
        return this.props.attachmentId
    }

    set attachment(attachmentId: UniqueEntityID | undefined | null) {
        this.props.attachmentId = attachmentId;
    }

    static create(
        props: Optional<PackageProps, 'pickedUpAt' | 'deliveredAt' | 'attachmentId'>,
        id?: UniqueEntityID
    ) {
        const newPackage = new Package({
            ...props,
            postedAt: props.postedAt ?? new Date(),
        }, id);

        return newPackage;
    }
}