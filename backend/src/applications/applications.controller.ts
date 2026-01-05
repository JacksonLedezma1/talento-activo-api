import { Body, Controller, Get, Post, Query, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entities';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationsService } from './applications.service';

@ApiTags('applications')
@ApiSecurity('api-key')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @Roles(Role.CODER)
  @ApiOperation({ summary: 'Postularse a una vacante (solo CODER)' })
  @ApiResponse({ status: 201, description: 'Postulación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Ya postulado, cupo lleno o más de 3 activas' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol CODER)' })
  create(
    @CurrentUser() user: { sub: number },
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.createApplication({
      userId: user.sub,
      vacancyId: dto.vacancyId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar postulaciones (CODER: propias; GESTOR: propias o por vacancyId)' })
  @ApiResponse({ status: 200, description: 'Lista de postulaciones' })
  findAll(
    @CurrentUser() user: { sub: number; role: Role },
    @Query('vacancyId') vacancyId?: string,
  ) {
    const parsedVacancyId = vacancyId ? Number(vacancyId) : undefined;

    let userId: number | undefined = undefined;

    if (user.role === Role.CODER) {
      userId = user.sub;
    } else if (user.role === Role.GESTOR) {
      if (!parsedVacancyId) {
        userId = user.sub;
      }
    }

    return this.applicationsService.findAll({
      vacancyId: parsedVacancyId,
      userId,
    });
  }

  @Patch(':id/status')
  @Roles(Role.GESTOR)
  @ApiOperation({ summary: 'Actualizar estado de postulación (solo GESTOR)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol GESTOR)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.GESTOR)
  @ApiOperation({ summary: 'Eliminar postulación (solo si está Activa) (solo GESTOR)' })
  @ApiResponse({ status: 200, description: 'Postulación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  @ApiResponse({ status: 400, description: 'Solo se pueden eliminar postulaciones Activas' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol GESTOR)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.remove(id);
  }
}
