import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';
import { Prisma } from '../generated/prisma';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    return this.prisma.person.create({
      data: createPersonDto,
      include: {
        department: true,
        user: true,
        salaryHistory: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PersonWhereUniqueInput;
    where?: Prisma.PersonWhereInput;
    orderBy?: Prisma.PersonOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.person.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        department: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        salaryHistory: {
          orderBy: {
            effectiveDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
      include: {
        department: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        salaryHistory: {
          orderBy: {
            effectiveDate: 'desc',
          },
        },
      },
    });
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
      include: {
        department: true,
        user: true,
        salaryHistory: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.person.delete({
      where: { id },
    });
  }

  async findByDepartment(departmentId: string) {
    return this.prisma.person.findMany({
      where: { departmentId },
      include: {
        department: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        salaryHistory: {
          orderBy: {
            effectiveDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
