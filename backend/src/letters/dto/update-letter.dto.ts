import { PartialType } from '@nestjs/mapped-types';
import { CreateLetterDto } from './create-letters.dto';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { LetterStatus, Priority } from '../../entities/letter.entity';

export class UpdateLetterDto extends PartialType(CreateLetterDto) {
    @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  distanceKm?: number;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsUUID()
  pigeonId?: string;

  @IsOptional()
  @IsEnum(LetterStatus)
  status?: LetterStatus;

  @IsOptional()
  @IsUUID()
  senderId?: string;

  @IsOptional()
  @IsUUID()
  recipientId?: string;
}