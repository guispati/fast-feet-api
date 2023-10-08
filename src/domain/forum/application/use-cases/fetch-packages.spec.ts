import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { FetchPackagesUseCase } from './fetch-packages';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: FetchPackagesUseCase;

describe('Fetch Recent Packages', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);
        
        sut = new FetchPackagesUseCase(inMemoryPackagesRepository);
    });

    it('should be able to fetch packages', async () => {
        await inMemoryPackagesRepository.create(makePackage());

        await inMemoryPackagesRepository.create(makePackage());

        await inMemoryPackagesRepository.create(makePackage());

        await sut.execute();

        expect(inMemoryPackagesRepository.items).toHaveLength(3);
    });
});
