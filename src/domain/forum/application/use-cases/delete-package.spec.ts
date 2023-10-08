import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { DeletePackageUseCase } from './delete-package';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: DeletePackageUseCase;

describe('Delete Package', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);
        
        sut = new DeletePackageUseCase(inMemoryPackagesRepository);
    });

    it('should be able to delete a package', async () => {
        const newPackage = makePackage({}, new UniqueEntityID('package-1'));

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: 'package-1',
        });
    
        expect(inMemoryPackagesRepository.items).toHaveLength(0);
    });
});
