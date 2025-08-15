import { PartialType } from '@nestjs/mapped-types';
import { CreatePigeonDto } from './create-pigeon.dto';
import { IsOptional, IsUUID, IsEnum, IsString } from 'class-validator';
import { LetterStatus } from '../../entities/letter.entity';

export class UpdateClientDto extends PartialType(CreatePigeonDto) {
    @IsOptional()
    @IsUUID()
    favoritePigeonId?: string;

    @IsOptional()
    @IsEnum(LetterStatus)
    status?: LetterStatus;

    @IsOptional()
    @IsString()
    note?: string;
}
