    // src/registrations/dto/update-status.dto.ts
    import { IsEnum, IsNotEmpty } from 'class-validator';
    import { RegistrationStatus } from '../entities/registration.entity';

    export class UpdateRegistrationStatusDto {
    @IsEnum(RegistrationStatus, { message: 'Status harus berupa PENDING, CONFIRMED, atau CANCELLED' })
    @IsNotEmpty()
    status!: RegistrationStatus;
}