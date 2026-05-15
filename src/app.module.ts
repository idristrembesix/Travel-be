import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ParticipantsModule } from './participants/participants.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { DestinationsModule } from './destinations/destinations.module';
import { PackagesModule } from './packages/packages.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // 1. Inisialisasi ConfigModule agar membaca file .env
    ConfigModule.forRoot({
      isGlobal: true, // Membuat env bisa diakses dari module mana saja
    }),

    // 2. Gunakan forRootAsync agar TypeORM menunggu file .env selesai dibaca
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD') || '', // Fallback string kosong untuk XAMPP
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Ingat: Hanya aktif selama tahap development!
      }),
    }),

    UsersModule,

    ParticipantsModule,

    RegistrationsModule,

    DestinationsModule,

    PackagesModule,

    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}