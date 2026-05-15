        // src/users/users.service.ts
        import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
        import { InjectRepository } from '@nestjs/typeorm';
        import { Like, Repository } from 'typeorm';
        import * as bcrypt from 'bcrypt';
        import { JwtService } from '@nestjs/jwt'; // Wajib di-import
        import { User } from './entities/user.entity';
        import { CreateUserDto } from './dto/create-user.dto';
        import { LoginUserDto } from './dto/login-user.dto';

        @Injectable()
        export class UsersService {
        constructor(
            @InjectRepository(User)
            private userRepo: Repository<User>,
            
            // PERBAIKAN: JwtService harus di-inject di dalam constructor sini!
            private jwtService: JwtService,
        ) {}
        async register(createUserDto: CreateUserDto): Promise<User> {
            const { email, password, fullName, role } = createUserDto;

            // 1. Cek apakah email sudah terdaftar
            const existingUser = await this.userRepo.findOne({ where: { email } });
            if (existingUser) {
            throw new BadRequestException('Email sudah terdaftar di sistem');
            }

            // 2. Hash Password (Enkripsi)
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // 3. Simpan ke database (Ganti password asli dengan passwordHash)
            const newUser = this.userRepo.create({
            email,
            passwordHash,
            fullName,
            role,
            });

            // 4. Return data yang disimpan
            return await this.userRepo.save(newUser);
        }

        async login(loginDto: LoginUserDto) {
            const { email, password } = loginDto;

            // 1. Cari user berdasarkan email
            const user = await this.userRepo.findOne({ where: { email } });
            if (!user) {
            throw new UnauthorizedException('Kredensial tidak valid (Email tidak ditemukan)');
            }

            // 2. Bandingkan password yang diinput dengan passwordHash di database
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
            throw new UnauthorizedException('Kredensial tidak valid (Password salah)');
            }

            // 3. Jika cocok, buat payload untuk JWT (Data yang diselipkan dalam token)
            const payload = { sub: user.id, email: user.email, role: user.role };

            // 4. Generate Token dan kembalikan ke Frontend
            return {
            accessToken: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                fullName: user.fullName,
                role: user.role,
            },
            };
        }
                async findAll(page: number = 1, limit: number = 10, search?: string) {
                    const skip = (page - 1) * limit;

                    const whereKondisi = search ? [
                    { email: Like(`%${search}%`) }
                    ] : {};

                    const [data, total] = await this.userRepo.findAndCount({
                    where: whereKondisi,
                    take: limit,
                    skip: skip,
                    });

                    return {
                    data,
                    meta: {
                        totalData: total,
                        halamanSekarang: page,
                        totalHalaman: Math.ceil(total / limit),
                    },
                    };
                }
        async removeBulk(ids: string[]) {
        const result = await this.userRepo.delete(ids);
        return { message: `${result.affected} data pengguna berhasil dihapus` };
        }


        async update(id: string, updateData: any) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
        }

        // Skeptis: Jangan izinkan update password langsung dari endpoint ini
        // tanpa hashing (enkripsi) ulang. Kita hapus properti password jika ada yang iseng mengirimnya.
        if (updateData.password) {
        delete updateData.password; 
        }

        Object.assign(user, updateData);
        return await this.userRepo.save(user);
    }
        }