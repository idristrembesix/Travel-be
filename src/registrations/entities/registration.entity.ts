    import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
    import { TourPackage } from '../../packages/entities/tour-package.entity';
    import { Participant } from '../../participants/entities/participant.entity';

    export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    }

    @Entity('registrations')
    export class Registration {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: RegistrationStatus, default: RegistrationStatus.PENDING })
    status!: RegistrationStatus;

    @CreateDateColumn()
    registeredAt!: Date;

    // -----------------------------------------------------
    // PERBAIKAN: Menambahkan (tourPackage) => tourPackage.registrations
    // -----------------------------------------------------
    @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.registrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'packageId' })
    package!: TourPackage;

    @Column()
    packageId!: string;

    // -----------------------------------------------------
    // Relasi ke Participant
    // -----------------------------------------------------
    @ManyToOne(() => Participant, (participant) => participant.registrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'participantId' })
    participant!: Participant;

    @Column()
    participantId!: string;
    }