    import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'; // Tambahkan Query
    import { AuthGuard } from '@nestjs/passport';
    import { ParticipantsService } from './participants.service';
import { Roles } from '../users/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../users/roles.guard';

    @Controller('participants')
    @UseGuards(AuthGuard('jwt'))
    export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search? : string
    ) {
        return this.participantsService.findAll(Number(page), Number(limit), search);
    }

        @Delete('bulk')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    removeBulk(@Body('ids') ids: string[]) {
        return this.participantsService.removeBulk(ids);
    }

    @Patch(':id')
  // Tanpa @Roles, berarti Staff dan Admin yang sudah login (punya Token) bisa akses
    update(
        @Param('id') id: string,
        @Body() updateData: any
    ) {
        return this.participantsService.update(id, updateData);
    }
    }