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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['Activa', 'En proceso', 'Aprobada', 'Rechazada'],
    default: 'Activa',
  })
  status: ApplicationStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((application: Application) => application.user)
  userId: number;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @RelationId((application: Application) => application.vacancy)
  vacancyId: number;

  @CreateDateColumn()
  appliedAt: Date;
}
