import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TourPackage } from './entities/tour-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage])], // Daftarkan di sini!
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}