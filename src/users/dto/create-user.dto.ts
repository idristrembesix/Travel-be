    // src/users/dto/create-user.dto.ts
    import { IsEmail, IsNotEmpty, IsEnum, MinLength, IsString } from 'class-validator';
    import { UserRole } from '../entities/user.entity';

    export class CreateUserDto {
    @IsEmail({}, { message: 'Format email tidak valid' })
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password minimal 6 karakter' })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
    fullName!: string;

    @IsEnum(UserRole, { message: 'Role harus berupa ADMIN atau STAFF' })
    role!: UserRole;
    }