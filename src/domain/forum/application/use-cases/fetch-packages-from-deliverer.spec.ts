import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchPackagedFromDelivererUseCase } from './fetch-packages-from-deliverer';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: FetchPackagedFromDelivererUseCase;

describe('Fetch Recent Packages', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new FetchPackagedFromDelivererUseCase(inMemoryPackagesRepository);
    });

    it('should be able to fetch packages from a given deliverer', async () => {
        const deliverer = makeDeliverer();

        await inMemoryPackagesRepository.create(makePackage({
            status: 'delivered',
            delivererId: deliverer.id,
        }));

        await inMemoryPackagesRepository.create(makePackage({
            status: 'delivered',
            delivererId: deliverer.id,
        }));

        await inMemoryPackagesRepository.create(makePackage({
            status: 'delivered',
            delivererId: deliverer.id,
        }));

        const result = await sut.execute({
            delivererId: deliverer.id.toString(),
        });

        expect(result.value?.packages).toEqual(expect.arrayContaining([
            expect.objectContaining({
                status: 'delivered',
                delivererId: deliverer.id,
            }),
            expect.objectContaining({
                status: 'delivered',
                delivererId: deliverer.id,
            }),
            expect.objectContaining({
                status: 'delivered',
                delivererId: deliverer.id,
            }),
        ]));
    });

    it('should not be able to fetch packages from another deliverer', async () => {
        await inMemoryPackagesRepository.create(makePackage({
            status: 'delivered',
            delivererId: new UniqueEntityID('deliverer-1'),
        }));

        await inMemoryPackagesRepository.create(makePackage({
            status: 'delivered',
            delivererId: new UniqueEntityID('deliverer-2'),
        }));

        const result = await sut.execute({
            delivererId: 'deliverer-1',
        });

        expect(result.value?.packages).toHaveLength(1);
        expect(result.value?.packages[0]).toEqual(expect.objectContaining({
            status: 'delivered',
            delivererId: new UniqueEntityID('deliverer-1'),
        }));
    });
});
