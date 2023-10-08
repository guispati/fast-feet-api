import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository';
import { makePackage } from 'test/factories/make-package';
import { MarkPackageAsDeliveredUseCase } from './mark-package-as-delivered';
import { makeAttachment } from 'test/factories/make-attachment';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryPackagesRepository: InMemoryPackagesRepository;

let sut: MarkPackageAsDeliveredUseCase;

describe('Mark package as delivered', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
        inMemoryPackagesRepository = new InMemoryPackagesRepository(inMemoryRecipientsRepository);

        sut = new MarkPackageAsDeliveredUseCase(
            inMemoryPackagesRepository,
        );
    });

    it('should be able to mark a package with the status delivered', async () => {
        const attachment = makeAttachment();
        const attachmentId = attachment.id.toString();


        const newPackage = makePackage();

        await inMemoryPackagesRepository.create(newPackage);

        await sut.execute({
            packageId: newPackage.id.toString(),
            attachmentId,
        });
    
        expect(inMemoryPackagesRepository.items[0]).toMatchObject({
            status: 'delivered',
            attachmentId: attachment.id,
        });
    });
});
