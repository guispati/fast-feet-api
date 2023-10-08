import { DomainEvents } from "@/core/events/domain-events";
import { RecipientsRepository } from "@/domain/forum/application/repositories/recipients-repository";
import { Recipient } from "@/domain/forum/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
    public items: Recipient[] = [];
    
    async findById(id: string) {
        const newRecipient = this.items.find(item => item.id.toString() === id);
        
        if (!newRecipient) {
            return null;
        }
        
        return newRecipient;
    }
    
    async create(newRecipient: Recipient) {
        this.items.push(newRecipient);

        DomainEvents.dispatchEventsForAggregate(newRecipient.id);
    }

    async findMany() {
        const recipients = this.items;

        return recipients;
    }

    async findManyByCity(city: string) {
        const recipients = this.items.filter(item => item.city === city);

        return recipients;
    }

    async save(newRecipient: Recipient) {
        const itemIndex = this.items.findIndex(item => item.id === newRecipient.id);

        this.items[itemIndex] = newRecipient;

        DomainEvents.dispatchEventsForAggregate(newRecipient.id);
    }

    async delete(newRecipient: Recipient) {
        const itemIndex = this.items.findIndex(item => item.id === newRecipient.id);
        
        this.items.splice(itemIndex, 1);
    }
}