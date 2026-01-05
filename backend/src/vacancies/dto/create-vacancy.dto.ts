import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Modality } from '../vacancy.entity';

export class CreateVacancyDto {
  @ApiProperty({
    description: 'Título de la vacante',
    example: 'Backend Developer NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del puesto',
    example: 'Buscamos experto en microservicios con experiencia en NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Tecnologías requeridas (separadas por comas)',
    example: 'NestJS, TypeScript, PostgreSQL, Docker',
  })
  @IsString()
  @IsNotEmpty()
  technologies: string;

  @ApiProperty({
    description: 'Nivel de senioridad requerido',
    example: 'Senior',
  })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({
    description: 'Habilidades blandas requeridas (separadas por comas)',
    example: 'Comunicación, Trabajo en equipo, Liderazgo',
  })
  @IsString()
  @IsNotEmpty()
  softSkills: string;

  @ApiProperty({
    description: 'Ubicación de trabajo',
    example: 'Remoto',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Modalidad de trabajo',
    enum: Modality,
    example: 'remote',
  })
  @IsEnum(Modality)
  modality: Modality;

  @ApiPropertyOptional({
    description: 'Rango salarial',
    example: '$3000-$5000 USD',
  })
  @IsString()
  @IsOptional()
  salaryRange?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la empresa',
    example: 'Tech Corp',
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'Número máximo de postulantes',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  maxApplicants: number;
}
