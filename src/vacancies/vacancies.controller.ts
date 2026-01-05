import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entities';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  findAll(@CurrentUser() user: { role: Role }) {
    if (user.role === Role.CODER) {
      return this.vacanciesService.findActive();
    }

    return this.vacanciesService.findAll();
  }

  @Post()
  @Roles(Role.GESTOR)
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.GESTOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, dto);
  }
}
