import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Modality } from '../vacancy.entity';

export class CreateVacancyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  technologies: string;

  @IsString()
  @IsNotEmpty()
  seniority: string;

  @IsString()
  @IsNotEmpty()
  softSkills: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(Modality)
  modality: Modality;

  @IsString()
  @IsOptional()
  salaryRange?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsInt()
  @Min(1)
  maxApplicants: number;
}
