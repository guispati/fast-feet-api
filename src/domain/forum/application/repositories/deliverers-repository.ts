import { Deliverer } from "../../enterprise/entities/deliverer";

export abstract class DeliverersRepository {
    abstract findByCpf(cpf: string): Promise<Deliverer | null>;
    abstract findById(id: string): Promise<Deliverer | null>;
    abstract create(deliverer: Deliverer): Promise<void>;
    abstract findMany(): Promise<Deliverer[]>;
    abstract save(deliverer: Deliverer): Promise<void>;
    abstract delete(deliverer: Deliverer): Promise<void>;
}