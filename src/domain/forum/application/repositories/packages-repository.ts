import { Package } from "../../enterprise/entities/package";

export abstract class PackagesRepository {
    abstract findById(id: string): Promise<Package | null>;
    abstract create(newPackage: Package): Promise<void>;
    abstract findMany(): Promise<Package[]>;
    abstract findManyByDelivererId(delivererId: string): Promise<Package[]>
    abstract findManyNearbyLocation(location: string): Promise<Package[]>
    abstract save(newPackage: Package): Promise<void>;
    abstract delete(newPackage: Package): Promise<void>;
}