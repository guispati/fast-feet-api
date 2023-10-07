import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Deliverer } from "../../enterprise/entities/deliverer";
import { HashGenerator } from "../cryptography/hash-generator";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterDelivererUseCaseRequest {
    name: string;
    cpf: string;
    password: string;
}

type RegisterDelivererUseCaseResponse = Either<
    UserAlreadyExistsError,
    {
        deliverer: Deliverer;
    }
>;

@Injectable()
export class RegisterDelivererUseCase {
    constructor(
        private deliverersRepository: DeliverersRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        name,
        cpf,
        password,
    }: RegisterDelivererUseCaseRequest): Promise<RegisterDelivererUseCaseResponse> {
        const delivererWithSameCpf = await this.deliverersRepository.findByCpf(cpf);

        if (delivererWithSameCpf) {
            return left(new UserAlreadyExistsError(cpf));
        }

        const hashedPassword = await this.hashGenerator.hash(password);

        const deliverer = Deliverer.create({
            name,
            cpf,
            password: hashedPassword,
        });

        await this.deliverersRepository.create(deliverer);

        return right({
            deliverer,
        });
    }
}