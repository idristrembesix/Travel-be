    import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

    export class LoginUserDto {
    @IsEmail({}, { message: 'Format email tidak valid' })
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    password!: string;
    }