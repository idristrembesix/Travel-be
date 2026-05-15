import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './entities/registration.entity';
// Tambahkan 2 import ini
import { Participant } from '../participants/entities/participant.entity';
import { TourPackage } from '../packages/entities/tour-package.entity';

@Module({
  // WAJIB daftarkan ketiga entitas ini agar bisa di-inject di Service
  imports: [TypeOrmModule.forFeature([Registration, Participant, TourPackage])],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
})
export class RegistrationsModule {}