import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { MarkPackageAsReturnedUseCase } from './mark-package-as-returned';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: MarkPackageAsReturnedUseCase;

describe('Mark package as returned', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new MarkPackageAsReturnedUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to mark a package with the status returned', async () => {
        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: newPackage.id.toString(),
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            status: 'returned',
        });
    });
});
