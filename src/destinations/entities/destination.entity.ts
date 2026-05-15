    import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
    import { TourPackage } from '../../packages/entities/tour-package.entity';

    @Entity('destinations')
    export class Destination {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string; // Contoh: "Jepang", "Turki"

    @Column()
    location!: string; // Contoh: "Asia Timur", "Eropa"

    @Column({nullable : true})//tambah image 
    image! : string;


    // Relasi: 1 Destinasi bisa memiliki banyak Paket Tur
    @OneToMany(() => TourPackage, (tourPackage) => tourPackage.destination)
    packages!: TourPackage[];
    }