    import { Controller, Get, Post, Body, UseGuards, Request, Query, Delete, Param, Patch, Search } from '@nestjs/common';
    import { AuthGuard } from '@nestjs/passport';
    import { PackagesService } from './packages.service';
    import { CreatePackageDto } from './dto/create-package.dto';

    // Import RBAC
    import { Roles } from '../users/roles.decorator';
    import { RolesGuard } from '../users/roles.guard';
    import { UserRole } from '../users/entities/user.entity';

    @Controller('packages')
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Pasang 2 Satpam
    export class PackagesController {
    constructor(private readonly packagesService: PackagesService) {}

    @Post()
    @Roles(UserRole.ADMIN) // GEMBOK: HANYA ADMIN
    create(@Body() createPackageDto: CreatePackageDto, @Request() req: any) {
        const authorId = req.user.userId;
        return this.packagesService.create(createPackageDto, authorId);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        return this.packagesService.findAll(Number(page), Number(limit), search);
    }

        @Delete('bulk')
    @Roles(UserRole.ADMIN)
    removeBulk(@Body('ids') ids: string[]) {
        return this.packagesService.removeBulk(ids);
    }

    @Patch(':id')
  @Roles(UserRole.ADMIN) // Hanya Admin
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePackageDto>
    ) {
        return this.packagesService.update(id, updateData);
    }
    }