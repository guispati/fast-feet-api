import { OnStatusChanged } from "./on-status-changed";
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { makePackage } from "test/factories/make-package";
import { InMemoryPackagesRepository } from "test/repositories/in-memory-packages-repository";
import { MarkPackageAsWaitingUseCase } from "@/domain/forum/application/use-cases/mark-package-as-waiting";
import { makeRecipient } from "test/factories/make-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let markPackageAsWaitingUseCase: MarkPackageAsWaitingUseCase;

let sendNotificationExecuteSpy: SpyInstance<
    [SendNotificationUseCaseRequest],
    Promise<SendNotificationUseCaseResponse>
>;

describe('On Status Changed', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository);
        markPackageAsWaitingUseCase = new MarkPackageAsWaitingUseCase(inMemoryPackagesRepository);

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

        new OnStatusChanged(inMemoryRecipientsRepository, sendNotificationUseCase);
    });

    it('should send a notification when the package status change', async () => {
        const recipient = makeRecipient({
            name: 'Recipient',
        }, new UniqueEntityID('recipient-1'));

        inMemoryRecipientsRepository.create(recipient);

        const newPackage = makePackage({
            recipientId: recipient.id,
        });

        inMemoryPackagesRepository.create(newPackage);
        await markPackageAsWaitingUseCase.execute({
            packageId: newPackage.id.toString(),
        });

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});