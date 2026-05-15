import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // 1. Import mesin Express

async function bootstrap() {
  // 2. Beritahu NestJS bahwa kita memakai Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // 3. Jadikan folder 'uploads' bisa diakses secara publik lewat URL /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

    // --- BUKA GEMBOK CORS DI SINI ---
  app.enableCors({
    origin: '*', // Mengizinkan akses dari semua frontend (localhost:3001, domain.com, dll)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();