import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Application } from '../applications/application.entity';

export enum Modality {
  REMOTE = 'remote',
  ONSITE = 'office',
  HYBRID = 'hybrid',
}

@Entity('vacancies')
export class Vacancy {
  @ApiProperty({
    description: 'ID único de la vacante',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Título de la vacante',
    example: 'Backend Developer NestJS',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del puesto',
    example: 'Buscamos experto en microservicios...',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Tecnologías requeridas (separadas por comas)',
    example: 'NestJS, TypeScript, PostgreSQL',
  })
  @Column()
  technologies: string;

  @ApiProperty({
    description: 'Nivel de senioridad requerido',
    example: 'Senior',
  })
  @Column()
  seniority: string;

  @ApiProperty({
    description: 'Habilidades blandas requeridas (separadas por comas)',
    example: 'Comunicación, Trabajo en equipo',
  })
  @Column()
  softSkills: string;

  @ApiProperty({
    description: 'Ubicación de trabajo',
    example: 'Remoto',
  })
  @Column()
  location: string;

  @ApiProperty({
    description: 'Modalidad de trabajo',
    enum: Modality,
    example: Modality.REMOTE,
  })
  @Column({
    type: 'enum',
    enum: Modality,
  })
  modality: Modality;

  @ApiPropertyOptional({
    description: 'Rango salarial',
    example: '$3000-$5000 USD',
  })
  @Column({ nullable: true })
  salaryRange: string;

  @ApiPropertyOptional({
    description: 'Nombre de la empresa',
    example: 'Tech Corp',
  })
  @Column({ nullable: true })
  company: string;

  @ApiProperty({
    description: 'Número máximo de postulantes',
    example: 10,
  })
  @Column({ type: 'int' })
  maxApplicants: number;

  @ApiProperty({
    description: 'Estado de la vacante (activa/inactiva)',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación de la vacante',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Application,
    (application: Application) => application.vacancy,
  )
  applications: Application[];

  @ApiPropertyOptional({
    description: 'Número actual de postulantes (calculado)',
    example: 3,
  })
  applicantsCount?: number;

  @ApiPropertyOptional({
    description: 'Indica si el usuario actual ya postuló a esta vacante',
    example: false,
  })
  hasApplied?: boolean;

  @ApiPropertyOptional({
    description: 'Estado de la postulación del usuario actual',
    example: 'Activa',
  })
  applicationStatus?: string;
}
