    // src/users/users.controller.ts
    import { Controller, Post, Body, Get, UseGuards, Query, Delete, Patch, Param } from '@nestjs/common';
    import { UsersService } from './users.service';
    import { CreateUserDto } from './dto/create-user.dto';
    import { LoginUserDto } from './dto/login-user.dto';
import { UserRole } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

    @Controller('users')
    export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        // Kita panggil service, tapi kita jangan kembalikan passwordHash-nya ke frontend demi keamanan
        const user = await this.usersService.register(createUserDto);
        return {
        message: 'User berhasil didaftarkan',
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        },
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginUserDto) {
        return this.usersService.login(loginDto);
    }
        @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search? : string
    ) {
        return this.usersService.findAll(Number(page), Number(limit), search);
    }

    @Delete('bulk')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    removeBulk(@Body('ids') ids: string[]) {
        return this.usersService.removeBulk(ids);
    }

    @Patch(':id')
  @Roles(UserRole.ADMIN) // Wajib Admin
    update(
    @Param('id') id: string,
    @Body() updateData: any
    ) {
    return this.usersService.update(id, updateData);
        }
    }
