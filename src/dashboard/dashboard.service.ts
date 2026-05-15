    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';

    import { Registration } from '../registrations/entities/registration.entity';
    import { Participant } from '../participants/entities/participant.entity';
    import { TourPackage } from '../packages/entities/tour-package.entity';
    import { Destination } from '../destinations/entities/destination.entity';

    @Injectable()
    export class DashboardService {
    constructor(
        @InjectRepository(Registration) private regRepo: Repository<Registration>,
        @InjectRepository(Participant) private participantRepo: Repository<Participant>,
        @InjectRepository(TourPackage) private packageRepo: Repository<TourPackage>,
        @InjectRepository(Destination) private destinationRepo: Repository<Destination>,
    ) {}

    async getStats() {
        // Jalankan semua query perhitungan secara bersamaan agar lebih cepat (Promise.all)
        const [
        totalRegistrations,
        pendingRegistrations,
        confirmedRegistrations,
        totalParticipants,
        totalPackages,
        totalDestinations
        ] = await Promise.all([
        this.regRepo.count(), // Hitung semua registrasi
        this.regRepo.count({ where: { status: 'PENDING' as any } }), 
        this.regRepo.count({ where: { status: 'CONFIRMED' as any } }),    
        this.participantRepo.count(),
        this.packageRepo.count(),
        this.destinationRepo.count(),
        ]);

        // Kembalikan dalam format JSON yang rapi
        return {
        registrations: {
            total: totalRegistrations,
            pending: pendingRegistrations,
            confirmed: confirmedRegistrations,
        },
        participants: totalParticipants,
        packages: totalPackages,
        destinations: totalDestinations,
        };
    }
    }