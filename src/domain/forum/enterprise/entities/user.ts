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

    get cpf() {
        return this.props.cpf;
    }

    get password() {
        return this.props.password;
    }
}