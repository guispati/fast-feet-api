import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { DeliverersRepository } from "../repositories/deliverers-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateDelivererUseCaseRequest {
    cpf: string;
    password: string;
}

type AuthenticateDelivererUseCaseResponse = Either<
    WrongCredentialsError,
    {
        accessToken: string;
    }
>;

@Injectable()
export class AuthenticateDelivererUseCase {
    constructor(
        private deliverersRepository: DeliverersRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) {}

    async execute({
        cpf,
        password,
    }: AuthenticateDelivererUseCaseRequest): Promise<AuthenticateDelivererUseCaseResponse> {
        const deliverer = await this.deliverersRepository.findByCpf(cpf);

        if (!deliverer) {
            return left(new WrongCredentialsError());
        }

        const isPasswordValid = await this.hashComparer.compare(password, deliverer.password);
        
        if (!isPasswordValid) {
            return left(new WrongCredentialsError());
        }

        const accessToken = await this.encrypter.encrypt({ sub: deliverer.id.toString() });

        return right({
            accessToken,
        });
    }
}