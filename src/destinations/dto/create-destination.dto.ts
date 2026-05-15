    // src/destinations/dto/create-destination.dto.ts
    import { IsString, IsNotEmpty } from 'class-validator';

    export class CreateDestinationDto {
    @IsString()
    @IsNotEmpty({ message: 'Nama destinasi tidak boleh kosong' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Lokasi destinasi tidak boleh kosong' })
    location!: string;
    }