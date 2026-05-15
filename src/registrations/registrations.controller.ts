    // src/registrations/registrations.controller.ts
    import {
    Controller,
    Post,
    Body,
    UseGuards,
    Param,
    Patch,
    Get,
    Query,
    Delete,
    } from '@nestjs/common';
    import { AuthGuard } from '@nestjs/passport';
    import { RegistrationsService } from './registrations.service';
    import { CreateRegistrationDto } from './dto/create-registration.dto';
    import { UpdateRegistrationStatusDto } from './dto/update-status.dto';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/roles.guard';
import { UserRole } from '../users/entities/user.entity';

    @Controller('registrations')
    @UseGuards(AuthGuard('jwt')) // Wajib login!
    export class RegistrationsController {
    constructor(private readonly registrationsService: RegistrationsService) {}

    @Post()
    create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return this.registrationsService.registerParticipant(createRegistrationDto);
    }
    // TAMBAHKAN ENDPOINT INI
    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string, // Mengambil ID dari URL
        @Body() updateDto: UpdateRegistrationStatusDto, // Mengambil status dari Body
    ) {
        return this.registrationsService.updateStatus(id, updateDto.status);
    }
                @Get()
        findAll(
            @Query('page') page: number = 1,
            @Query('limit') limit: number = 10,
            @Query('status') status?: string // <-- Menangkap filter status dari URL
        ) {
            return this.registrationsService.findAll(Number(page), Number(limit), status);
        }
        // Tambahkan endpoint ini. Wajib ditaruh di atas fungsi dengan parameter /:id (jika ada)
        @Delete('bulk')
        @UseGuards(AuthGuard('jwt'), RolesGuard)
        @Roles(UserRole.ADMIN) // Gembok: Hanya Admin yang boleh hapus massal
        removeBulk(@Body('ids') ids: string[]) {
            return this.registrationsService.removeBulk(ids);
        }


        @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateData: any
    ) {
        return this.registrationsService.update(id, updateData);
  }
    }
