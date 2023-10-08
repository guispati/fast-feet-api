import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { CreateRecipientUseCase } from './create-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;

let sut: CreateRecipientUseCase;

describe('Create Recipient', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        
        sut = new CreateRecipientUseCase(inMemoryRecipientsRepository);
    });

    it('should be able to create a new recipient', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            address: 'Street 1',
            city: 'City',
            state: 'State',
            zipcode: '12.12345-000',
        });
    
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            recipient: inMemoryRecipientsRepository.items[0],
        });
    });
});
