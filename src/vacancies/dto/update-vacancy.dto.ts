import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Modality } from '../vacancy.entity';

export class UpdateVacancyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  technologies?: string;

  @IsString()
  @IsOptional()
  seniority?: string;

  @IsString()
  @IsOptional()
  softSkills?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(Modality)
  @IsOptional()
  modality?: Modality;

  @IsString()
  @IsOptional()
  salaryRange?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxApplicants?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
