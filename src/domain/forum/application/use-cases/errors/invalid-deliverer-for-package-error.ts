import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidDelivererForPackageError extends Error implements UseCaseError {
    constructor() {
        super(`Only the deliverer that has withdrawn this package can mark it as delivered.`);
    }
}