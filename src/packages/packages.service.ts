    // src/packages/packages.service.ts
    import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Like, Repository } from 'typeorm';
    import { TourPackage } from './entities/tour-package.entity';
    import { CreatePackageDto } from './dto/create-package.dto';
    import { AuthGuard } from '@nestjs/passport';

    @Injectable()
    @UseGuards(AuthGuard('jwt')) // <-- INI GEMBOKNYA! Berlaku untuk semua rute di bawahnya
    export class PackagesService {
    constructor(
        @InjectRepository(TourPackage)
        private packageRepo: Repository<TourPackage>,
    ) {}

    async create(createPackageDto: CreatePackageDto, authorId: string) {
        // Kita gabungkan data dari DTO dengan authorId yang didapat dari Token
        const newPackage = this.packageRepo.create({
        ...createPackageDto,
        authorId: authorId,
        });

        return await this.packageRepo.save(newPackage);
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        
        // Cari berdasarkan judul paket
        const whereKondisi = search ? { title: Like(`%${search}%`) } : {};

        const [data, total] = await this.packageRepo.findAndCount({
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
    const result = await this.packageRepo.delete(ids);
    return { message: `${result.affected} data paket wisata berhasil dihapus` };
    }


    async update(id: string, updateData: Partial<CreatePackageDto>) {
    const packageData = await this.packageRepo.findOne({ where: { id } });
    if (!packageData) {
        throw new NotFoundException(`Paket dengan ID ${id} tidak ditemukan`);
    }

    Object.assign(packageData, updateData);
    return await this.packageRepo.save(packageData);
    }
    }
