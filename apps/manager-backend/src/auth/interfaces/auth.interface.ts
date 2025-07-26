import { UserRole, Person } from '../../generated/prisma';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  personId: string | null;
  person: Person | null;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}
