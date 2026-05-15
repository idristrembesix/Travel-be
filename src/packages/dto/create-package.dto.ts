    // src/packages/dto/create-package.dto.ts
    import { IsString, IsNotEmpty, IsInt, IsDateString, IsUUID } from 'class-validator';

    export class CreatePackageDto {
    @IsString()
    @IsNotEmpty({ message: 'Judul paket tidak boleh kosong' })
    title!: string;

    @IsInt({ message: 'Kuota harus berupa angka' })
    quota!: number;

    @IsDateString({}, { message: 'Format tanggal mulai salah (Gunakan YYYY-MM-DD)' })
    startDate!: string;

    @IsDateString({}, { message: 'Format tanggal selesai salah (Gunakan YYYY-MM-DD)' })
    endDate!: string;

    @IsUUID('all', { message: 'Destination ID harus berupa UUID yang valid' })
    @IsNotEmpty()
    destinationId!: string;
    }