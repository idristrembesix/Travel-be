    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Like, Repository } from 'typeorm';
    import { Participant } from './entities/participant.entity';

    @Injectable()
    export class ParticipantsService {
    constructor(
        @InjectRepository(Participant) private participantRepo: Repository<Participant>,
    ) {}

async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        // PERBAIKAN: Gunakan nama kolom yang BENAR sesuai Entity
        const whereKondisi = search ? [
            { fullName: Like(`%${search}%`) },
            { identityNumber: Like(`%${search}%`) },
            { phoneNumber: Like(`%${search}%`) }
        ] : {};

        const [data, total] = await this.participantRepo.findAndCount({
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
    const result = await this.participantRepo.delete(ids);
    return { message: `${result.affected} data peserta berhasil dihapus` };
    }


    async update(id: string, updateData: any) { // Menggunakan 'any' agar fleksibel menerima perubahan parsial
    const participant = await this.participantRepo.findOne({ where: { id } });
    if (!participant) {
        throw new NotFoundException(`Peserta dengan ID ${id} tidak ditemukan`);
    }

    Object.assign(participant, updateData);
    return await this.participantRepo.save(participant);
    }
    }