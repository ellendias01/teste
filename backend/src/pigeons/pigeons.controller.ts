import { Controller, Get, Post, Body, Param, Put, Patch, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PigeonsService } from './pigeons.service';

@Controller('pigeons')
export class PigeonsController {
  constructor(private svc: PigeonsService) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() body) {
    const { nickname } = body;
    if (!nickname) throw new BadRequestException('nickname required');
    return this.svc.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.svc.update(id, body);
  }

  @Patch(':id/retire')
  retire(@Param('id') id: string) {
    return this.svc.retire(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Apenas imagens são permitidas'), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const rnd = Date.now();
        const ext = extname(file.originalname);
        cb(null, `${rnd}${ext}`);
      }
    })
  }))
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo necessário');
    const path = `/uploads/${file.filename}`;
    return this.svc.setPhoto(id, path);
  }
}
