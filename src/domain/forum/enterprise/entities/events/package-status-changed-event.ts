import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Package } from "../package";

export class PackageStatusChangedEvent implements DomainEvent {
    public ocurredAt: Date;
    public package: Package;

    constructor(newPackage: Package) {
        this.package = newPackage;
        this.ocurredAt = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.package.id;
    }
}