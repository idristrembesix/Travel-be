        // src/registrations/registrations.service.ts
        import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
        import { InjectRepository } from '@nestjs/typeorm';
        import { Repository } from 'typeorm';
        import { Registration, RegistrationStatus } from './entities/registration.entity';
        import { Participant } from '../participants/entities/participant.entity';
        import { TourPackage } from '../packages/entities/tour-package.entity';
        import { CreateRegistrationDto } from './dto/create-registration.dto';

        @Injectable()
        export class RegistrationsService {
        constructor(
            @InjectRepository(Registration) private regRepo: Repository<Registration>,
            @InjectRepository(Participant) private participantRepo: Repository<Participant>,
            @InjectRepository(TourPackage) private packageRepo: Repository<TourPackage>,
        ) {}

        async registerParticipant(dto: CreateRegistrationDto) {
            // 1. Cek apakah Paket Wisata ada
            const tourPackage = await this.packageRepo.findOne({
            where: { id: dto.packageId },
            relations: ['registrations'], // Tarik data pendaftar yang sudah ada
            });

            if (!tourPackage) throw new NotFoundException('Paket wisata tidak ditemukan');

            // 2. Proteksi Kuota (Skeptis: Jangan sampai overbooking!)
            if (tourPackage.registrations.length >= tourPackage.quota) {
            throw new BadRequestException('Mohon maaf, kuota paket ini sudah penuh');
            }

            // 3. Cari Peserta berdasarkan NIK, kalau belum ada, buat baru
            let participant = await this.participantRepo.findOne({
            where: { identityNumber: dto.identityNumber },
            });

            if (!participant) {
            participant = this.participantRepo.create({
                identityNumber: dto.identityNumber,
                fullName: dto.fullName,
                phoneNumber: dto.phoneNumber,
            });
            participant = await this.participantRepo.save(participant);
            }

            // 4. Cek apakah peserta sudah pernah daftar di paket yang SAMA
            const existingReg = await this.regRepo.findOne({
            where: { packageId: tourPackage.id, participantId: participant.id },
            });

            if (existingReg) {
            throw new BadRequestException('Peserta dengan NIK tersebut sudah terdaftar di paket ini');
            }

            // 5. Buat Nota Registrasi
            const newRegistration = this.regRepo.create({
            packageId: tourPackage.id,
            participantId: participant.id,
            // status otomatis menjadi PENDING
            });

            return await this.regRepo.save(newRegistration);
        }

        // Tambahkan fungsi ini di bawah fungsi registerParticipant
        async updateStatus(id: string, newStatus: RegistrationStatus) {
            // 1. Cari data pendaftaran berdasarkan ID
            const registration = await this.regRepo.findOne({
            where: { id },
            });

            if (!registration) {
            throw new NotFoundException('Data registrasi tidak ditemukan');
            }

            // 2. Timpa status lama dengan status baru
            registration.status = newStatus;

            // 3. Simpan perubahan ke database
            return await this.regRepo.save(registration);
        }
        // Tambahkan fungsi ini di bawah fungsi updateStatus
        // Parameter default: kalau tidak disuruh, tampilkan halaman 1, maksimal 10 data
    async findAll(page: number = 1, limit: number = 10, status?: string) {
        const skip = (page - 1) * limit;

        // Logika Skeptis: Jika parameter status dikirim (misal "PENDING"), cari yang persis sama.
        // Kita gunakan "as any" untuk mencegah TypeScript protes soal Enum.
        const whereKondisi = status ? { status: status as any } : {};

        const [data, total] = await this.regRepo.findAndCount({
        where: whereKondisi,
        take: limit,
        skip: skip,
        });

        return {
        data,
        meta: {
            totalData: total,
            halamanSekarang: page,
            totalHalaman: Math.ceil(total / limit),
        },
        };
    }
        async removeBulk(ids: string[]) {
        // TypeORM mengeksekusi query: DELETE FROM registrations WHERE id IN (id1, id2...)
        const result = await this.regRepo.delete(ids);
        return { message: `${result.affected} data registrasi berhasil dihapus` };
        }

        async update(id: string, updateData: any) {
        const registration = await this.regRepo.findOne({ where: { id } });
        if (!registration) {
            throw new NotFoundException(`Registrasi dengan ID ${id} tidak ditemukan`);
        }

        Object.assign(registration, updateData);
        return await this.regRepo.save(registration);
        }
        }