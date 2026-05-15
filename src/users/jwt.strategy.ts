    // src/users/jwt.strategy.ts
    import { ExtractJwt, Strategy } from 'passport-jwt';
    import { PassportStrategy } from '@nestjs/passport';
    import { Injectable } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config';

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
        // Mengambil token dari header: Authorization: Bearer <token>
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false, // Tolak token jika sudah kedaluwarsa
        // Gunakan kunci rahasia yang sama dari file .env
        secretOrKey: configService.get<string>('JWT_SECRET') || '', 
        });
    }

    // Fungsi ini HANYA akan tereksekusi jika token valid dan belum kedaluwarsa
    async validate(payload: any) {
        // Data ini akan otomatis ditempelkan oleh NestJS ke dalam object `req.user`
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
    }