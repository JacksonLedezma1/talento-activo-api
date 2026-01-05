import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async createUser(input: { name: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.usersRepository.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
    });

    const saved = await this.usersRepository.save(user);

    const { password: _password, ...safe } = saved;
    return safe;
  }
}
