import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidStatusToMarkPackageAsDeliveredError extends Error implements UseCaseError {
    constructor() {
        super(`The previous status to mark the package as delivered must be withdrawn.`);
    }
}