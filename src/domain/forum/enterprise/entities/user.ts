import { Entity } from "@/core/entities/entity";

export interface UserProps {
    name: string;
    cpf: string;
    password: string;
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }

    get cpf() {
        return this.props.cpf;
    }

    set cpf(cpf: string) {
        this.props.cpf = cpf;
    }

    get password() {
        return this.props.password;
    }

    set password(password: string) {
        this.props.password = password;
    }
}