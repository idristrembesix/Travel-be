    // src/registrations/dto/create-registration.dto.ts
    import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

    export class CreateRegistrationDto {
    @IsUUID('all', { message: 'Package ID tidak valid' })
    @IsNotEmpty()
    packageId!: string;

    @IsString()
    @IsNotEmpty({ message: 'NIK/No. Identitas wajib diisi' })
    identityNumber!: string;

    @IsString()
    @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
    fullName!: string;

    @IsString()
    @IsNotEmpty({ message: 'Nomor HP wajib diisi' })
    phoneNumber!: string;
    }