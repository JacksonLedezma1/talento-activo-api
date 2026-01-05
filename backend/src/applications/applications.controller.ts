import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entities';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

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
  @Roles(Role.GESTOR)
  findAll(@Query('vacancyId') vacancyId?: string) {
    const parsedVacancyId = vacancyId ? Number(vacancyId) : undefined;
    return this.applicationsService.findAll({ vacancyId: parsedVacancyId });
  }
}
