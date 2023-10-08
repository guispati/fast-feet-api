import { InMemoryDeliverersRepository } from 'test/repositories/in-memory-deliverers-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { FetchDeliverersUseCase } from './fetch-deliverers';

let inMemoryDeliverersRepository: InMemoryDeliverersRepository;
let sut: FetchDeliverersUseCase;

describe('Fetch Recent Deliverers', () => {
    beforeEach(() => {
        inMemoryDeliverersRepository = new InMemoryDeliverersRepository();
        sut = new FetchDeliverersUseCase(inMemoryDeliverersRepository);
    });

    it('should be able to fetch deliverers', async () => {
        await inMemoryDeliverersRepository.create(makeDeliverer());

        await inMemoryDeliverersRepository.create(makeDeliverer());

        await inMemoryDeliverersRepository.create(makeDeliverer());

        await sut.execute();

        expect(inMemoryDeliverersRepository.items).toHaveLength(3);
    });
});
