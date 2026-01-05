import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User, Role } from './users/users.entities';
import { Vacancy } from './vacancies/vacancy.entity';
import { Application } from './applications/application.entity';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Vacancy, Application],
    synchronize: true,
  });

  await dataSource.initialize();

  const usersRepository = dataSource.getRepository(User);

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@talento.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const gestorEmail = process.env.SEED_GESTOR_EMAIL ?? 'gestor@talento.com';
  const gestorPassword = process.env.SEED_GESTOR_PASSWORD ?? 'Gestor123!';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const gestorHash = await bcrypt.hash(gestorPassword, 10);

  const existingAdmin = await usersRepository.findOne({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    await usersRepository.save(
      usersRepository.create({
        name: 'Admin',
        email: adminEmail,
        password: adminHash,
        role: Role.ADMIN,
        isActive: true,
      }),
    );
  } else {
    await usersRepository.update(
      { id: existingAdmin.id },
      { role: Role.ADMIN, isActive: true },
    );
  }

  const existingGestor = await usersRepository.findOne({
    where: { email: gestorEmail },
  });
  if (!existingGestor) {
    await usersRepository.save(
      usersRepository.create({
        name: 'Gestor',
        email: gestorEmail,
        password: gestorHash,
        role: Role.GESTOR,
        isActive: true,
      }),
    );
  } else {
    await usersRepository.update(
      { id: existingGestor.id },
      { role: Role.GESTOR, isActive: true },
    );
  }

  await dataSource.destroy();
}

seed().catch(async (error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
