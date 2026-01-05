import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './users.entities';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiSecurity('api-key')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'No autorizado (requiere rol ADMIN)' })
  findAll() {
    return this.usersService.findAll();
  }
}
