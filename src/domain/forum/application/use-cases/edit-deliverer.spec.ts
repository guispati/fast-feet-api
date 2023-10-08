import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { EditDelivererUseCase } from './edit-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let sut: EditDelivererUseCase;

describe('Edit Deliverer', () => {
    beforeEach(() => {
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();

        sut = new EditDelivererUseCase(
            inMemoryDeliverersRepository,
        );
    });

    it('should be able to edit a deliverer', async () => {
        const newDeliverer = makeDeliverer({
            delivererId: new UniqueEntityID('deliverer-1'),
        }, new UniqueEntityID('deliverer-1'));

        await inMemoryDeliverersRepository.create(newDeliverer);

        await sut.execute({
            delivererId: 'deliverer-1',
            name: 'John Doe',
            cpf: '123.123.123-12',
            location: 'City 1'
        });
    
        expect(inMemoryDeliverersRepository.items[0]).toMatchObject({
            name: 'John Doe',
            cpf: '123.123.123-12',
            location: 'City 1',
        });
    });
});
