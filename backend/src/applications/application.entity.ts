import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entities';
import { Vacancy } from '../vacancies/vacancy.entity';

export enum ApplicationStatus {
  ACTIVA = 'Activa',
  EN_PROCESO = 'En proceso',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

@Entity('applications')
@Unique('uq_user_vacancy', ['user', 'vacancy'])
export class Application {
  @ApiProperty({
    description: 'ID único de la postulación',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Estado de la postulación',
    enum: ApplicationStatus,
    example: ApplicationStatus.ACTIVA,
  })
  @Column({
    type: 'enum',
    enum: ['Activa', 'En proceso', 'Aprobada', 'Rechazada'],
    default: 'Activa',
  })
  status: ApplicationStatus;

  @ApiProperty({
    description: 'Usuario que postula',
    type: () => User,
  })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'ID del usuario que postula',
    example: 1,
  })
  @RelationId((application: Application) => application.user)
  userId: number;

  @ApiProperty({
    description: 'Vacante a la que se postula',
    type: () => Vacancy,
  })
  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @ApiProperty({
    description: 'ID de la vacante',
    example: 1,
  })
  @RelationId((application: Application) => application.vacancy)
  vacancyId: number;

  @ApiProperty({
    description: 'Fecha en que se realizó la postulación',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  appliedAt: Date;
}
