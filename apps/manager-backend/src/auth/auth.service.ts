import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole, Person } from '../generated/prisma';

interface ValidatedUser {
  id: string;
  email: string;
  role: UserRole;
  personId: string | null;
  person: Person | null;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<ValidatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { person: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: ValidatedUser) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      personId: user.personId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        person: user.person,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    role: UserRole;
    personId?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        personId: data.personId,
      },
      include: { person: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });
  }
}
