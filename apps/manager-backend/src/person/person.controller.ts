import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma';
import type { AuthRequest } from '../auth/interfaces/auth.interface';

@Controller('persons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @Roles(UserRole.HR_ADMIN, UserRole.MANAGER)
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @Roles(UserRole.HR_ADMIN, UserRole.MANAGER)
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('departmentId') departmentId?: string
  ) {
    const params = {
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where: departmentId ? { departmentId } : undefined,
    };
    return this.personService.findAll(params);
  }

  @Get('me')
  findMyProfile(@Request() req: AuthRequest) {
    if (!req.user.personId) {
      return null;
    }
    return this.personService.findOne(req.user.personId);
  }

  @Get(':id')
  @Roles(UserRole.HR_ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.HR_ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @Roles(UserRole.HR_ADMIN)
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }

  @Get('department/:departmentId')
  @Roles(UserRole.HR_ADMIN, UserRole.MANAGER)
  findByDepartment(@Param('departmentId') departmentId: string) {
    return this.personService.findByDepartment(departmentId);
  }
}
