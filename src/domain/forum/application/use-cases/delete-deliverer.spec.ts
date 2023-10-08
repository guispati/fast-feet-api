import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { DeleteDelivererUseCase } from './delete-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let sut: DeleteDelivererUseCase;

describe('Delete Deliverer', () => {
    beforeEach(() => {
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        sut = new DeleteDelivererUseCase(inMemoryDeliverersRepository);
    });

    it('should be able to delete a deliverer', async () => {
        const newDeliverer = makeDeliverer({
            delivererId: new UniqueEntityID('deliverer-1'),
        });

        await inMemoryDeliverersRepository.create(newDeliverer);

        await sut.execute({
            delivererId: 'deliverer-1',
        });
    
        expect(inMemoryDeliverersRepository.items).toHaveLength(0);
    });
});
