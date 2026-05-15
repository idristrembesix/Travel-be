    import { Controller, Get, Post, Body, UseGuards, Query, UseInterceptors, UploadedFile, Delete, Patch, Param, Search } from '@nestjs/common';
    import { FileInterceptor } from '@nestjs/platform-express';
    import { diskStorage } from 'multer';
    import { extname } from 'path';
    import { AuthGuard } from '@nestjs/passport';
    import { DestinationsService } from './destinations.service';
    import { CreateDestinationDto } from './dto/create-destination.dto';
    import { Roles } from '../users/roles.decorator';
    import { RolesGuard } from '../users/roles.guard';
    import { UserRole } from '../users/entities/user.entity';

    @Controller('destinations')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    export class DestinationsController {
    constructor(private readonly destinationsService: DestinationsService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    // --- MESIN MULTER DIMULAI ---
    // Mencegat file dari kolom (key) bernama 'image'
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
        destination: './uploads', // Tempat menyimpan file fisik
        filename: (req, file, cb) => {
            // Logika skeptis: Jangan percaya nama file asli dari user.
            // Kalau ada 2 orang upload "bali.jpg", file lama akan tertimpa.
            // Kita ubah namanya pakai kombinasi Waktu + Angka Acak.
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            // Contoh hasil: 168123456789-123456789.jpg
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
        }),
    }))
    // --- MESIN MULTER SELESAI ---
    create(
        @Body() createDestinationDto: CreateDestinationDto,
        @UploadedFile() file: Express.Multer.File // Tangkap file yang sudah diproses Multer
    ) {
        // Jika ada file yang diupload, ambil nama file barunya. Jika tidak, jadikan null.
        const imageName = file ? file.filename : undefined;
        return this.destinationsService.create(createDestinationDto, imageName);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        return this.destinationsService.findAll(Number(page), Number(limit), search);   
     }

    @Delete('bulk')
    @Roles(UserRole.ADMIN)
    removeBulk(@Body('ids') ids: string[]) {
        return this.destinationsService.removeBulk(ids);
    }

        @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
        }),
    }))
    update(
        @Param('id') id: string, // Tangkap ID dari URL
        @Body() updateDestinationDto: Partial<CreateDestinationDto>, // Data teks yang mau diubah
        @UploadedFile() file?: Express.Multer.File // File foto baru (kalau ada)
    ) {
        const newImageName = file ? file.filename : undefined;
        return this.destinationsService.update(id, updateDestinationDto, newImageName);
    }
    }