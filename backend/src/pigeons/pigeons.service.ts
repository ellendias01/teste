import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pigeon } from '../entities/pigeon.entity';

@Injectable()
export class PigeonsService {
  constructor(
    @InjectRepository(Pigeon)
    private repo: Repository<Pigeon>
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const p = await this.repo.findOneBy({ id });
    if (!p) throw new NotFoundException('Pombo não encontrado');
    return p;
  }

  create(data: Partial<Pigeon>) {
    const p = this.repo.create(data);
    return this.repo.save(p);
  }

  async update(id: string, data: Partial<Pigeon>) {
  const p = await this.findOne(id);
  if (p.retired && data.averageSpeed) {
    throw new BadRequestException('Não pode atualizar velocidade de pombo aposentado');
  }
  await this.repo.update(id, data);
  return this.findOne(id);
}

  async retire(id: string) {
    const p = await this.findOne(id);
    if (p.retired) throw new BadRequestException('Pombo já aposentado');
    p.retired = true;
    return this.repo.save(p);
  }

  async setPhoto(id: string, path: string) {
    const p = await this.findOne(id);
    p.photo = path;
    return this.repo.save(p);
  }

  async incrementDeliveries(pigeonId: string) {
    const p = await this.findOne(pigeonId);
    p.deliveriesCount = (p.deliveriesCount || 0) + 1;
    return this.repo.save(p);
  }
}
