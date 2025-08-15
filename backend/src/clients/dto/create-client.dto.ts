import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateClientDto {
  @IsString() @Length(2, 120)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional() @IsString()
  birthDate?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString()
  cep?: string;

  @IsOptional() @IsString()
  street?: string;

  @IsOptional() @IsString()
  number?: string;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsString()
  state?: string;

  @IsOptional() @IsString()
  complement?: string;

  @IsOptional() @IsString()
  neighborhood?: string;

  @IsOptional() @IsUUID()
  favoritePigeonId?: string;
}
