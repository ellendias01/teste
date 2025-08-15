import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Pigeon, HealthStatus } from './entities/pigeon.entity';
import { Client } from './entities/client.entity';
import { Letter, LetterStatus, Priority } from './entities/letter.entity';
import { join } from 'path';

async function run() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: join(__dirname, '..', 'data.sqlite'),
    entities: [Pigeon, Client, Letter],
    synchronize: true
  });
  await dataSource.initialize();

  const pigeonRepo = dataSource.getRepository(Pigeon);
  const clientRepo = dataSource.getRepository(Client);
  const letterRepo = dataSource.getRepository(Letter);

  const p1 = pigeonRepo.create({ nickname: 'Rápido', averageSpeed: 40, age: '2 years', maxDistanceKm: 100, healthStatus: HealthStatus.ACTIVE });
  const p2 = pigeonRepo.create({ nickname: 'Frajola', averageSpeed: 30, age: '3 years', maxDistanceKm: 50, healthStatus: HealthStatus.REST });
  await pigeonRepo.save([p1, p2]);

  const c1 = clientRepo.create({ name: 'João', email: 'joao@example.com', address: 'Rua A, 123', phone: '19999990000', city: 'Franca', state: 'SP', favoritePigeon: p1 });
  const c2 = clientRepo.create({ name: 'Maria', email: 'maria@example.com', address: 'Rua B, 456', phone: '19999990001' });
  await clientRepo.save([c1, c2]);

  const letters: Partial<Letter>[] = [
    {
      content: 'Oi Maria!',
      address: 'Rua B, 456',
      recipient: c2,
      sender: c1,
      pigeon: p1,
      status: LetterStatus.NA_FILA,
      distanceKm: 10,
      eta: new Date().toISOString(),
      priority: Priority.NORMAL,
      statusHistory: [{ status: LetterStatus.NA_FILA, date: new Date().toISOString() }],
      note: '',
    },
  ];

  await letterRepo.save(letters);




  console.log('Seed complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
