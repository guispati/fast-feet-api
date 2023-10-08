import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { FetchPackagesNearbyDelivererLocationUseCase } from './fetch-packages-nearby-deliverer-location';
import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: FetchPackagesNearbyDelivererLocationUseCase;

describe('Fetch Recent Packages', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new FetchPackagesNearbyDelivererLocationUseCase(
            inMemoryPackagesRepository,
            inMemoryDeliverersRepository,
        );
    });

    it('should be able to fetch packages nearby a given deliverer', async () => {
        const deliverer = makeDeliverer({
            location: 'City Example',
            delivererId: new UniqueEntityID('deliverer-1'),
        });

        await inMemoryDeliverersRepository.create(deliverer);

        const recipient = makeRecipient({
            city: 'City Example',
        });

        await inMemoryRecipientsRepository.create(recipient);

        await inMemoryPackagesRepository.create(makePackage({
            delivererId: deliverer.delivererId,
            recipientId: recipient.id,
        }));

        await inMemoryPackagesRepository.create(makePackage({
            delivererId: deliverer.delivererId,
            recipientId: recipient.id,
        }));

        await inMemoryPackagesRepository.create(makePackage({
            delivererId: deliverer.delivererId,
            recipientId: recipient.id,
        }));

        const result = await sut.execute({
            delivererId: deliverer.delivererId.toString(),
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            packages: expect.arrayContaining([
                expect.objectContaining({
                    recipientId: recipient.id,
                    delivererId: deliverer.delivererId,
                }),
                expect.objectContaining({
                    recipientId: recipient.id,
                    delivererId: deliverer.delivererId,
                }),
                expect.objectContaining({
                    recipientId: recipient.id,
                    delivererId: deliverer.delivererId,
                }),
            ]),
        });
    });

    it('should not be able to fetch packages away from the given deliverer\' location', async () => {
        const deliverer = makeDeliverer({
            location: 'City Nearby',
            delivererId: new UniqueEntityID('deliverer-1'),
        });

        await inMemoryDeliverersRepository.create(deliverer);

        const recipientNearby = makeRecipient({
            city: 'City Nearby',
        });

        const recipientAway = makeRecipient({
            city: 'City Away',
        });

        await inMemoryRecipientsRepository.create(recipientNearby);
        await inMemoryRecipientsRepository.create(recipientAway);
        
        await inMemoryPackagesRepository.create(makePackage({
            recipientId: recipientNearby.id,
            delivererId: deliverer.delivererId,
        }));

        await inMemoryPackagesRepository.create(makePackage({
            recipientId: recipientAway.id,
            delivererId: deliverer.delivererId,
        }));

        const result = await sut.execute({
            delivererId: 'deliverer-1',
        });

        expect(result.isRight()).toBe(true);
        if (result.isRight()) {
            expect(result.value.packages).toHaveLength(1);

            expect(result.value.packages[0]).toEqual(expect.objectContaining({
                recipientId: recipientNearby.id,
                delivererId: new UniqueEntityID('deliverer-1'),
            }));
        }
    });
});
