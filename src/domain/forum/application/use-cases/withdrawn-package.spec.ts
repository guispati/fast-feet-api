import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { WithdrawnPackageUseCase } from './withdrawn-package';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: WithdrawnPackageUseCase;

describe('Withdrawn package', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new WithdrawnPackageUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to the user to withdrawn a package', async () => {
        const deliverer = makeDeliverer();
        const delivererId = deliverer.id.toString();

        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: newPackage.id.toString(),
            delivererId,
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            status: 'withdrawn',
            delivererId: deliverer.id,
        });
    });
});
