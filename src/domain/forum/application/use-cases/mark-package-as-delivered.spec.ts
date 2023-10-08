import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { MarkPackageAsDeliveredUseCase } from './mark-package-as-delivered';
import { makeAttachment } from 'test/factories/make-attachment';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { WithdrawnPackageUseCase } from './withdrawn-package';
import { InvalidDelivererForPackageError } from './errors/invalid-deliverer-for-package-error';
import { InvalidStatusToMarkPackageAsDeliveredError } from './errors/invalid-status-to-mark-package-as-delivered-error';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;
let inMemoryDeliverersRepository: InMemoryDeliverersRepository;

let withdrawnPackageUseCase : WithdrawnPackageUseCase;

let sut: MarkPackageAsDeliveredUseCase;

describe('Mark package as delivered', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        withdrawnPackageUseCase = new WithdrawnPackageUseCase(inMemoryPackagesRepository);

        sut = new MarkPackageAsDeliveredUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to mark a package with the status delivered', async () => {
        const attachment = makeAttachment();

        const deliverer = makeDeliverer({
            delivererId: new UniqueEntityID('deliverer-1'),
        });

        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await withdrawnPackageUseCase.execute({
            packageId: newPackage.id.toString(),
            delivererId: deliverer.id.toString(),
        });

        await sut.execute({
            packageId: newPackage.id.toString(),
            delivererId: deliverer.id.toString(),
            attachmentId: attachment.id.toString(),
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            status: 'delivered',
            attachmentId: attachment.id,
            delivererId: deliverer.id,
        });
    });

    it('should not be able to mark a package as delivered when the previous package status is not withdrawn or is not set a delivererId', async () => {
        const attachment = makeAttachment();

        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        const result = await sut.execute({
            packageId: newPackage.id.toString(),
            delivererId: 'deliverer-1',
            attachmentId: attachment.id.toString(),
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(InvalidStatusToMarkPackageAsDeliveredError);
    });

    it('should not be able to mark a package as delivered when the is not the same deliverer that withdrawn the package', async () => {
        const attachment = makeAttachment();

        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await withdrawnPackageUseCase.execute({
            packageId: newPackage.id.toString(),
            delivererId: 'deliverer-1',
        });

        const result = await sut.execute({
            packageId: newPackage.id.toString(),
            delivererId: 'deliverer-2',
            attachmentId: attachment.id.toString(),
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(InvalidDelivererForPackageError);
    });
});
