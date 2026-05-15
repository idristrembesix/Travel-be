    import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
    import { Destination } from '../../destinations/entities/destination.entity';
    import { User } from '../../users/entities/user.entity';
    import { Registration } from '../../registrations/entities/registration.entity';

    @Entity('tour_packages')
    export class TourPackage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string; // Contoh: "Japan Winter Tour 2026"

    @Column('int')
    quota!: number;

    @Column({ type: 'date' })
    startDate!: Date;

    @Column({ type: 'date' })
    endDate!: Date;

    // -----------------------------------------------------
    // RELASI 1: Paket Tur -> Destinasi (Many to One)
    // -----------------------------------------------------
    @ManyToOne(() => Destination, (destination) => destination.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'destinationId' })
    destination!: Destination;

    @Column()
    destinationId!: string;

    // -----------------------------------------------------
    // RELASI 2: Paket Tur -> User/Admin Pembuat (Many to One)
    // -----------------------------------------------------
    @ManyToOne(() => User, (user) => user.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author!: User;

    @Column()
    authorId!: string;

    // -----------------------------------------------------
    // RELASI 3: Paket Tur -> Registrasi Peserta (One to Many)
    // -----------------------------------------------------
    @OneToMany(() => Registration, (registration) => registration.package)
    registrations!: Registration[];
    }