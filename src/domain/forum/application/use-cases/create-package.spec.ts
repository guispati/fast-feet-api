import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { CreatePackageUseCase } from './create-package';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: CreatePackageUseCase;

describe('Create Package', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);
        
        sut = new CreatePackageUseCase(inMemoryPackagesRepository);
    });

    it('should be able to create a new package', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            recipientId: 'example-recipient'
        });
    
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            package: inMemoryPackagesRepository.items[0],
        });
    });
});
