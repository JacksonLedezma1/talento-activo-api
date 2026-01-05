import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Modality } from '../vacancy.entity';

export class UpdateVacancyDto {
  @ApiPropertyOptional({
    description: 'Título de la vacante',
    example: 'Senior Backend Developer',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del puesto',
    example: 'Descripción actualizada...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tecnologías requeridas (separadas por comas)',
    example: 'NestJS, TypeScript, PostgreSQL',
  })
  @IsString()
  @IsOptional()
  technologies?: string;

  @ApiPropertyOptional({
    description: 'Nivel de senioridad requerido',
    example: 'Senior',
  })
  @IsString()
  @IsOptional()
  seniority?: string;

  @ApiPropertyOptional({
    description: 'Habilidades blandas requeridas (separadas por comas)',
    example: 'Comunicación, Liderazgo',
  })
  @IsString()
  @IsOptional()
  softSkills?: string;

  @ApiPropertyOptional({
    description: 'Ubicación de trabajo',
    example: 'Híbrido',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Modalidad de trabajo',
    enum: Modality,
    example: 'hybrid',
  })
  @IsEnum(Modality)
  @IsOptional()
  modality?: Modality;

  @ApiPropertyOptional({
    description: 'Rango salarial',
    example: '$4000-$6000 USD',
  })
  @IsString()
  @IsOptional()
  salaryRange?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la empresa',
    example: 'Tech Company',
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({
    description: 'Número máximo de postulantes',
    example: 15,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxApplicants?: number;

  @ApiPropertyOptional({
    description: 'Estado de la vacante (activa/inactiva)',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
