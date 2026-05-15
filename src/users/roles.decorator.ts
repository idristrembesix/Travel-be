// src/users/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from './entities/user.entity';

export const ROLES_KEY = 'roles';

// Decorator ini akan menempelkan array 'roles' ke dalam metadata endpoint
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);