import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PersonModule } from '../person/person.module';
import { DepartmentModule } from '../department/department.module';

@Module({
  imports: [AuthModule, PrismaModule, PersonModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
