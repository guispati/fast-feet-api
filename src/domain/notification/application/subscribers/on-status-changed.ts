import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";
import { PackageStatusChangedEvent } from "@/domain/forum/enterprise/entities/events/package-status-changed-event";
import { RecipientsRepository } from "@/domain/forum/application/repositories/recipients-repository";

@Injectable()
export class OnStatusChanged implements EventHandler {
    constructor(
        private recipientsRepository: RecipientsRepository,
        private sendNotification: SendNotificationUseCase,
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewStatusNotification.bind(this),
            PackageStatusChangedEvent.name
        );
    }

    private async sendNewStatusNotification({ package: packageNotification, ocurredAt }: PackageStatusChangedEvent) {
        const recipient = await this.recipientsRepository.findById(packageNotification.recipientId.toString());

        if (recipient) {
            await this.sendNotification.execute({
                recipientId: recipient.id.toString(),
                title: `Atualização da encomenda "${packageNotification.name.substring(0, 40).concat('...')}"`,
                content: `O status da encomenda "${packageNotification.name}" foi alterado para ${packageNotification.status} em ${ocurredAt}.`,
            });
        }

    }
}