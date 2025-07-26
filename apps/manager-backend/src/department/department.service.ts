import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
      include: {
        managers: true,
        _count: {
          select: { people: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        managers: true,
        _count: {
          select: { people: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        managers: true,
        people: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
      include: {
        managers: true,
        _count: {
          select: { people: true },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
