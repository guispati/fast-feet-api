import { DomainEvents } from "@/core/events/domain-events";
import { AdminsRepository } from "@/domain/forum/application/repositories/admins-repository";
import { Admin } from "@/domain/forum/enterprise/entities/admin";

export class InMemoryAdminsRepository implements AdminsRepository {
    public items: Admin[] = [];
    
    async findByCpf(cpf: string) {
        const admin = this.items.find(item => item.cpf === cpf);
        
        if (!admin) {
            return null;
        }
        
        return admin;
    }
    
    async create(admin: Admin) {
        this.items.push(admin);

        DomainEvents.dispatchEventsForAggregate(admin.id);
    }
}