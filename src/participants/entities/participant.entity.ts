    import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
    import { Registration } from '../../registrations/entities/registration.entity';

    @Entity('participants')
    export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    identityNumber!: string; // NIK atau Paspor

    @Column()
    fullName!: string;

    @Column()
    phoneNumber!: string;

    // Relasi OneToMany ke Registration
    @OneToMany(() => Registration, (registration) => registration.participant)
    registrations!: Registration[];
    }