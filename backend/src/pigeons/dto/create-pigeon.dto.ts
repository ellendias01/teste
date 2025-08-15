import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { HealthStatus } from '../../entities/pigeon.entity';

export class CreatePigeonDto {
  @IsString()
  nickname: string;

  @IsOptional() @IsString()
  photo?: string;

  @IsOptional() @IsNumber() @Min(0)
  averageSpeed?: number;

  @IsOptional() @IsNumber() @Min(0)
  maxDistanceKm?: number;

  @IsOptional() @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @IsOptional() @IsString()
  note?: string;
}
