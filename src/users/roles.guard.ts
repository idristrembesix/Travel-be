    // src/users/roles.guard.ts
    import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
    import { Reflector } from '@nestjs/core';
    import { ROLES_KEY } from './roles.decorator';
    import { UserRole } from './entities/user.entity';

    @Injectable()
    export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 1. Baca stempel @Roles dari endpoint yang sedang diakses
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);
        
        // 2. Jika endpoint tidak punya stempel @Roles, izinkan masuk (bebas role)
        if (!requiredRoles) {
        return true;
        }

        // 3. Ambil data user dari JWT hasil ekstraksi AuthGuard
        const { user } = context.switchToHttp().getRequest();
        
        // 4. Objektivitas sistem: Cegah jika data role tidak ada
        if (!user || !user.role) {
        throw new ForbiddenException('Akses ditolak: Identitas atau Role tidak ditemukan');
        }

        // 5. Cek apakah role user ada di dalam daftar role yang diizinkan
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
        throw new ForbiddenException('Akses ditolak: Anda tidak memiliki otoritas untuk tindakan ini');
        }

        return true; // Lolos inspeksi
    }
    }