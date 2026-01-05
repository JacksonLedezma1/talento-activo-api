import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entities';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';

@ApiTags('vacancies')
@ApiSecurity('api-key')
@ApiBearerAuth()
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) { }

  @Get()
  @ApiOperation({ summary: 'Listar vacantes (CODER: activas; GESTOR/ADMIN: todas)' })
  @ApiResponse({ status: 200, description: 'Lista de vacantes' })
  findAll(@CurrentUser() user: AuthUser) {
    if (user.role === Role.CODER) {
      return this.vacanciesService.findActive(user.sub);
    }

    return this.vacanciesService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vacante por ID' })
  @ApiResponse({ status: 200, description: 'Vacante encontrada' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.findById(id);
  }

  @Post()
  @Roles(Role.GESTOR)
  @ApiOperation({ summary: 'Crear una nueva vacante (solo GESTOR)' })
  @ApiResponse({ status: 201, description: 'Vacante creada exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol GESTOR)' })
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.GESTOR)
  @ApiOperation({ summary: 'Actualizar vacante (solo GESTOR)' })
  @ApiResponse({ status: 200, description: 'Vacante actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol GESTOR)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, dto);
  }
}
