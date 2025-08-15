import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pigeon } from '../entities/pigeon.entity';
import { PigeonsService } from './pigeons.service';
import { PigeonsController } from './pigeons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pigeon])],
  controllers: [PigeonsController],
  providers: [PigeonsService],
  exports: [PigeonsService]
})
export class PigeonsModule {}
