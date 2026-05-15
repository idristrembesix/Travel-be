    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { DashboardService } from './dashboard.service';
    import { AuthGuard } from '@nestjs/passport';

    @Controller('dashboard')
    @UseGuards(AuthGuard('jwt')) // Wajib login untuk melihat data ini
    export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }
    }