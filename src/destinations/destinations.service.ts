        // src/destinations/destinations.service.ts
        import { Injectable, NotFoundException } from '@nestjs/common';
        import { InjectRepository } from '@nestjs/typeorm';
        import { Like, Repository } from 'typeorm';
        import { Destination } from './entities/destination.entity';
        import { CreateDestinationDto } from './dto/create-destination.dto';
    import { join } from 'path';
    import * as fs from 'fs';

        @Injectable()
        export class DestinationsService {
        constructor(
            @InjectRepository(Destination)
            private destinationRepo: Repository<Destination>,
        ) {}

        // PERBAIKAN: Gunakan parameter opsional (image?: string) 
        // agar TypeORM menerima 'undefined' dengan baik.
        async create(createDestinationDto: CreateDestinationDto, image?: string) {
            const newDestination = this.destinationRepo.create({
            ...createDestinationDto,
            image: image, 
            });
            return await this.destinationRepo.save(newDestination);
        }

async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Logika Skeptis: Apakah user memasukkan kata pencarian?
    // Jika YA, cari berdasarkan nama ATAU lokasi yang mengandung kata tersebut.
    // Jika TIDAK, kembalikan objek kosong {} (ambil semua data).
        const whereKondisi = search ? [
        { name: Like(`%${search}%`) },
        { location: Like(`%${search}%`) }
        ] : {};

        const [data, total] = await this.destinationRepo.findAndCount({
        where: whereKondisi, // <-- Terapkan filter di sini
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
        const result = await this.destinationRepo.delete(ids);
        return { message: `${result.affected} data destinasi berhasil dihapus` };
        }

        async update(id: string, updateData: Partial<CreateDestinationDto>, newImageName?: string) {
        const destination = await this.destinationRepo.findOne({ where: { id } });
        
        if (!destination) {
        throw new NotFoundException('Data destinasi tidak ditemukan');
        }

        if (newImageName) {
        if (destination.image) {
            const oldImagePath = join(process.cwd(), 'uploads', destination.image);
            if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            }
        }
        destination.image = newImageName;
        }

        Object.assign(destination, updateData);
        return await this.destinationRepo.save(destination);
    }

        
        }