import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { MarkPackageAsWaitingUseCase } from './mark-package-as-waiting';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: MarkPackageAsWaitingUseCase;

describe('Mark package as waiting', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new MarkPackageAsWaitingUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to mark a package with the status waiting', async () => {
        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: newPackage.id.toString(),
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            status: 'waiting',
        });
    });
});
