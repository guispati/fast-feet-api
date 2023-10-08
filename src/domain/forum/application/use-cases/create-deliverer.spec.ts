import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { CreateDelivererUseCase } from './create-deliverer';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let fakeHasher: FakeHasher;

let sut: CreateDelivererUseCase;

describe('Create Deliverer', () => {
    beforeEach(() => {
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        fakeHasher = new FakeHasher();
        
        sut = new CreateDelivererUseCase(inMemoryDeliverersRepository, fakeHasher);
    });

    it('should be able to create a new deliverer', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            cpf: '123.123.123-12',
            password: '123456',
            location: 'City 1'
        });
    
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            deliverer: inMemoryDeliverersRepository.items[0],
        });
    });

    it('should hash deliverer password upon creation', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            cpf: '123.123.123-12',
            password: '123456',
            location: 'City 1'
        });
        
        const hashedPassword = await fakeHasher.hash('123456');
    
        expect(result.isRight()).toBe(true);
        expect(inMemoryDeliverersRepository.items[0].password).toEqual(hashedPassword);
    });
});
