import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TourPackage } from '../../packages/entities/tour-package.entity'; // Pastikan path import ini benar!

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role!: UserRole;

  // -----------------------------------------------------
  // INI ADALAH SOLUSI DARI ERROR "user.packages"
  // Relasi balikan: 1 User (Admin) bisa buat banyak Paket
  // -----------------------------------------------------
  @OneToMany(() => TourPackage, (tourPackage) => tourPackage.author)
  packages!: TourPackage[];
}