import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../application.entity';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la postulación',
    enum: ApplicationStatus,
    example: 'En proceso',
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
