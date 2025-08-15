import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from '../entities/letter.entity';
import { LettersService } from './letters.service';
import { LettersController } from './letters.controller';
import { Pigeon } from '../entities/pigeon.entity';
import { Client } from '../entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Letter, Pigeon, Client])],
  controllers: [LettersController],
  providers: [LettersService]
})
export class LettersModule {}
