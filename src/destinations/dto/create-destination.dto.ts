    // src/destinations/dto/create-destination.dto.ts
    import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

    export class CreateDestinationDto {
    @IsString()
    @IsNotEmpty({ message: 'Nama destinasi tidak boleh kosong' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Lokasi destinasi tidak boleh kosong' })
    location!: string;


    // Tambahkan validasi angka untuk harga
    @Type(() => Number) // Paksa ubah string dari FormData menjadi Number
    @IsNumber({}, { message: 'Harga estimasi harus berupa angka' })
    @IsOptional()
    estimatedPrice?: number;
    }
    