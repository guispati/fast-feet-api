import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditDelivererPasswordUseCase } from './edit-deliverer-password';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let fakeHasher: FakeHasher;
let sut: EditDelivererPasswordUseCase;

describe('Edit Deliverer', () => {
    beforeEach(() => {
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        fakeHasher = new FakeHasher();

        sut = new EditDelivererPasswordUseCase(
            inMemoryDeliverersRepository,
            fakeHasher,
        );
    });

    it('should be able to edit a deliverer', async () => {
        const newDeliverer = makeDeliverer({
            delivererId: new UniqueEntityID('deliverer-1'),
        }, new UniqueEntityID('deliverer-1'));

        await inMemoryDeliverersRepository.create(newDeliverer);

        await sut.execute({
            delivererId: 'deliverer-1',
            password: 'new-password',
        });

        const hashedPassword = await fakeHasher.hash('new-password');

        expect(inMemoryDeliverersRepository.items[0].password).toEqual(hashedPassword);
    });
});
