import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role } from '../users/users.entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(input: { name: string; email: string; password: string }) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado.');
    }

    const user = await this.usersService.createUser(input);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.usersService.findByEmailWithPassword(input.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo.');
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { password: _password, ...safeUser } = user;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: safeUser,
    };
  }
}
