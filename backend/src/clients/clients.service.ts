import { Injectable, NotFoundException ,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';


@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private repo: Repository<Client>) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const c = await this.repo.findOneBy({ id });
    if (!c) throw new NotFoundException('Cliente não encontrado');
    return c;
  }

  create(data: Partial<Client>) {
    const c = this.repo.create(data);
    return this.repo.save(c);
  }


  async update(id: string, data: Partial<Client>) {
  const client = await this.findOne(id);
  if (data.email) {
    const emailInUse = await this.repo.findOne({ where: { email: data.email } });
    if (emailInUse && emailInUse.id !== id) {
      throw new BadRequestException('Email já está em uso por outro cliente.');
    }
  }
  
    if (data.favoritePigeonId) {
      const pigeonExists = await this.repo.manager.findOne('Pigeon', {
                where: { id: data.favoritePigeonId }
      });
      if (!pigeonExists) {
        throw new BadRequestException('Pombo favorito não encontrado');
      }
    }

    await this.repo.update(id, {
      ...data,
      favoritePigeon: data.favoritePigeonId ? { id: data.favoritePigeonId } : null
    });

  return this.findOne(id);
}

  }

