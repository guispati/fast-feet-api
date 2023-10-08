import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { EditPackageUseCase } from './edit-package';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makePackage } from 'test/factories/make-package';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: EditPackageUseCase;

describe('Edit Package', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new EditPackageUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to edit a package', async () => {
        const newPackage = makePackage({
            name: 'Old Package',
        }, new UniqueEntityID('package-1'));

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: newPackage.id.toString(),
            recipientId: newPackage.recipientId.toString(),
            status: 'waiting',
            name: 'Updated package',
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            name: 'Updated package',
            status: 'waiting',
        });
    });
});
