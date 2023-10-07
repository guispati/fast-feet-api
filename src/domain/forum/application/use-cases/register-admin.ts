import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Admin } from "../../enterprise/entities/admin";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { AdminsRepository } from "../repositories/admins-repository";

interface RegisterAdminUseCaseRequest {
    name: string;
    cpf: string;
    password: string;
}

type RegisterAdminUseCaseResponse = Either<
    UserAlreadyExistsError,
    {
        admin: Admin;
    }
>;

@Injectable()
export class RegisterAdminUseCase {
    constructor(
        private adminsRepository: AdminsRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        name,
        cpf,
        password,
    }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
        const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf);

        if (adminWithSameCpf) {
            return left(new UserAlreadyExistsError(cpf));
        }

        const hashedPassword = await this.hashGenerator.hash(password);

        const admin = Admin.create({
            name,
            cpf,
            password: hashedPassword,
        });

        await this.adminsRepository.create(admin);

        return right({
            admin,
        });
    }
}