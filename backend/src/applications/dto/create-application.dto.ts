import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'ID de la vacante a la que se postula',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  vacancyId: number;
}
