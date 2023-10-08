import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { EditRecipientUseCase } from './edit-recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: EditRecipientUseCase;

describe('Edit Recipient', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

        sut = new EditRecipientUseCase(
            inMemoryRecipientsRepository,
        );
    });

    it('should be able to edit a recipient', async () => {
        const newRecipient = makeRecipient({
            name: 'Old Recipient',
        }, new UniqueEntityID('recipient-1'));

        await inMemoryRecipientsRepository.create(newRecipient);

        await sut.execute({
            recipientId: newRecipient.id.toString(),
            name: 'Updated recipient',
            address: 'Street 1',
            city: 'City',
            state: 'State',
            zipcode: '12.12345-000',
        });
    
        expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
            name: 'Updated recipient',
            address: 'Street 1',
            city: 'City',
            state: 'State',
            zipcode: '12.12345-000',
        });
    });
});
