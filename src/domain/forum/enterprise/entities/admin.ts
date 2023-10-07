import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Optional } from "@/core/types/optional";

export interface AdminProps extends UserProps {
    adminId: UniqueEntityID;
}

export class Admin extends User<AdminProps> {
    get adminId() {
        return this.props.adminId;
    }

    static create(props: Optional<AdminProps, 'adminId'>, id?: UniqueEntityID) {
        const admin = new Admin({
            ...props,
            adminId: props.adminId ?? new UniqueEntityID(),
        }, id);

        return admin;
    }
}