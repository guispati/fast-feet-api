import { DomainEvents } from "@/core/events/domain-events";
import { DeliverersRepository } from "@/domain/forum/application/repositories/deliverers-repository";
import { Deliverer } from "@/domain/forum/enterprise/entities/deliverer";

export class InMemoryDeliverersRepository implements DeliverersRepository {
    public items: Deliverer[] = [];
    
    async findByCpf(cpf: string) {
        const deliverer = this.items.find(item => item.cpf === cpf);
        
        if (!deliverer) {
            return null;
        }
        
        return deliverer;
    }

    async findById(id: string) {
        const deliverer = this.items.find(item => item.delivererId.toString() === id);
        
        if (!deliverer) {
            return null;
        }
        
        return deliverer;
    }
    
    async create(deliverer: Deliverer) {
        this.items.push(deliverer);

        DomainEvents.dispatchEventsForAggregate(deliverer.id);
    }

    async findMany() {
        const deliverers = this.items;

        return deliverers;
    }

    async save(deliverer: Deliverer) {
        const itemIndex = this.items.findIndex(item => item.delivererId === deliverer.delivererId);

        this.items[itemIndex] = deliverer;

        DomainEvents.dispatchEventsForAggregate(deliverer.delivererId);
    }

    async delete(deliverer: Deliverer) {
        const itemIndex = this.items.findIndex(item => item.delivererId === deliverer.delivererId);
        
        this.items.splice(itemIndex, 1);
    }
}