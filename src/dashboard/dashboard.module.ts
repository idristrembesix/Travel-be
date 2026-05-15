  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { DashboardController } from './dashboard.controller';
  import { DashboardService } from './dashboard.service';

  // Import entitas dari modul lain
  import { Registration } from '../registrations/entities/registration.entity';
  import { Participant } from '../participants/entities/participant.entity';
  import { TourPackage } from '../packages/entities/tour-package.entity';
  import { Destination } from '../destinations/entities/destination.entity';

  @Module({
    // Daftarkan tabel yang ingin dihitung
    imports: [TypeOrmModule.forFeature([Registration, Participant, TourPackage, Destination])],
    controllers: [DashboardController],
    providers: [DashboardService],
  })
  export class DashboardModule {}