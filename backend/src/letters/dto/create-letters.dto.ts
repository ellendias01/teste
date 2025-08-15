import { IsOptional, IsString, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from '../../entities/letter.entity';

export class CreateLetterDto {
  @IsString()
  content: string;

  @IsString()
  address: string;

  @IsUUID()
  recipientId: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  @IsOptional()
  pigeonId?: string;

  @IsString()
  note: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  distanceKm?: number;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}