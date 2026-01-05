import { Body, Controller, Get, Post, Query, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entities';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @Roles(Role.CODER)
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
  @Roles(Role.GESTOR, Role.CODER)
  findAll(
    @CurrentUser() user: { sub: number; role: Role },
    @Query('vacancyId') vacancyId?: string,
  ) {
    const parsedVacancyId = vacancyId ? Number(vacancyId) : undefined;

    // Lógica de filtrado:
    // 1. Un CODER solo puede ver sus propias postulaciones.
    // 2. Un GESTOR ve sus propias postulaciones, a menos que filtre por una vacante específica.
    // 3. Un ADMIN (por medio del RolesGuard) podría ver todo si no se aplica este filtro, 
    //    pero aquí definimos el comportamiento para los roles explícitos.

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
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.GESTOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.remove(id);
  }
}
