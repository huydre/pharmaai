import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicineModule } from './modules/medicine/medicine.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { PharmacyMedicineModule } from './modules/pharmacy-medicine/pharmacy-medicine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'pharmaai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
    MedicineModule,
    PharmacyModule,
    PharmacyMedicineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
