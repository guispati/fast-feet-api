import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository';
import { RegisterAdminUseCase } from './register-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryAdminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterAdminUseCase;

describe('Register Admin', () => {
    beforeEach(() => {
        inMemoryAdminsRepository = new InMemoryAdminsRepository();
        fakeHasher = new FakeHasher();
        sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher);
    });

    it('should be able to register a new admin', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            cpf: '123.123.123-12',
            password: '123456',
        });
    
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            admin: inMemoryAdminsRepository.items[0],
        });
    });

    it('should hash admin password upon registration', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            cpf: '123.123.123-12',
            password: '123456',
        });
        
        const hashedPassword = await fakeHasher.hash('123456');
    
        expect(result.isRight()).toBe(true);
        expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword);
    });
});
