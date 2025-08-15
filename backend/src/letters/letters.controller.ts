import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LettersService } from './letters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateLetterDto } from './dto/create-letters.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
// Enum Priority (exemplo)
export enum Priority {
  NORMAL = 'NORMAL',
  URGENTE = 'URGENTE',
}

@Controller('letters')
export class LettersController {
  constructor(private readonly svc: LettersService) { }

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() body: CreateLetterDto) {
    return this.svc.create(body);
  }
   
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() body: UpdateLetterDto) {
    return this.svc.update(id, body);
  }


  @Post(':id/signature')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${timestamp}${ext}`);
        },
      }),
    }),
  )
  uploadSignature(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo necessário');
    const path = `/uploads/${file.filename}`;
    return this.svc.setSignature(id, path);
  }
}
