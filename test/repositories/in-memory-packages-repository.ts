import { DomainEvents } from "@/core/events/domain-events";
import { PackagesRepository } from "@/domain/forum/application/repositories/packages-repository";
import { RecipientsRepository } from "@/domain/forum/application/repositories/recipients-repository";
import { Package } from "@/domain/forum/enterprise/entities/package";

export class InMemoryPackagesRepository implements PackagesRepository {
    public items: Package[] = [];

    constructor(
        private recipientsRepository: RecipientsRepository,
    ) {}
    
    async findById(id: string) {
        const newPackage = this.items.find(item => item.id.toString() === id);
        
        if (!newPackage) {
            return null;
        }
        
        return newPackage;
    }
    
    async create(newPackage: Package) {
        this.items.push(newPackage);

        DomainEvents.dispatchEventsForAggregate(newPackage.id);
    }

    async findMany() {
        const packages = this.items;

        return packages;
    }

    async findManyByDelivererId(delivererId: string) {
        const packages = this.items.filter(item => item.delivererId?.toString() === delivererId);

        return packages;
    }

    async findManyNearbyLocation(location: string) {
        const recipients = await this.recipientsRepository.findManyByCity(location);

        const filteredRecipientsId = recipients.map(recipient => recipient.id);

        const packages = this.items.filter(item => {
            return filteredRecipientsId.includes(item.recipientId)
        });

        return packages;
    }

    async save(newPackage: Package) {
        const itemIndex = this.items.findIndex(item => item.id === newPackage.id);

        this.items[itemIndex] = newPackage;

        DomainEvents.dispatchEventsForAggregate(newPackage.id);
    }

    async delete(newPackage: Package) {
        const itemIndex = this.items.findIndex(item => item.id === newPackage.id);
        
        this.items.splice(itemIndex, 1);
    }
}