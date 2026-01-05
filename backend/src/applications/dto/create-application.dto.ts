import { IsInt, Min } from 'class-validator';

export class CreateApplicationDto {
  @IsInt()
  @Min(1)
  vacancyId: number;
}
