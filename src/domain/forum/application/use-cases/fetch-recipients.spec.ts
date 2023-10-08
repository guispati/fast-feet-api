import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { FetchRecipientsUseCase } from './fetch-recipients';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchRecipientsUseCase;

describe('Fetch Recent Recipients', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository);
    });

    it('should be able to fetch recipients', async () => {
        await inMemoryRecipientsRepository.create(makeRecipient());

        await inMemoryRecipientsRepository.create(makeRecipient());

        await inMemoryRecipientsRepository.create(makeRecipient());

        await sut.execute();

        expect(inMemoryRecipientsRepository.items).toHaveLength(3);
    });
});
