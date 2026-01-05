import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../applications/application.entity';

export enum Modality {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  technologies: string;

  @Column()
  seniority: string;

  @Column()
  softSkills: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: Modality,
  })
  modality: Modality;

  @Column({ nullable: true })
  salaryRange: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'int' })
  maxApplicants: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Application,
    (application: Application) => application.vacancy,
  )
  applications: Application[];
}
