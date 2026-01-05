import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Application } from '../applications/application.entity';

export enum Role {
  ADMIN = 'admin',
  GESTOR = 'gestor',
  CODER = 'coder',
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario (único)',
    example: 'juan@example.com',
  })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: Role,
    example: Role.CODER,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CODER,
  })
  role: Role;

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Application, (application: Application) => application.user)
  applications: Application[];
}
