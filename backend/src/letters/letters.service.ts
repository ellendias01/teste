import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Letter, LetterStatus, Priority,StatusHistoryEntry} from '../entities/letter.entity';
import { Pigeon } from '../entities/pigeon.entity';
import { Client } from '../entities/client.entity';
import { UpdateLetterDto } from './dto/update-letter.dto';


@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(Letter) private repo: Repository<Letter>,
    @InjectRepository(Pigeon) private pigeonsRepo: Repository<Pigeon>,
    @InjectRepository(Client) private clientsRepo: Repository<Client>,
    private dataSource: DataSource
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const l = await this.repo.findOneBy({ id });
    if (!l) throw new NotFoundException('Carta não encontrada');
    return l;
  }

  private nowStr() {
    return new Date().toISOString();
  }

  private calcEta(pigeon: Pigeon, distanceKm?: number) {
    if (!pigeon || !pigeon.averageSpeed || !distanceKm) return null;
    const hours = distanceKm / pigeon.averageSpeed;
    const eta = new Date(Date.now() + Math.round(hours * 3600 * 1000));
    return eta.toISOString();
  }

  async create(data: any) {
    // valida prioridade
    if (data.priority && !Object.values(Priority).includes(data.priority)) {
      throw new BadRequestException('Prioridade inválida');
    }

    const recipient = await this.clientsRepo.findOneBy({ id: data.recipientId });
    const sender = await this.clientsRepo.findOneBy({ id: data.senderId });
    if (!recipient || !sender) throw new BadRequestException('Remetente ou destinatário inválido');

    let pigeon: Pigeon = null;
    if (data.pigeonId) {
      pigeon = await this.pigeonsRepo.findOneBy({ id: data.pigeonId });
      if (!pigeon) throw new BadRequestException('Pombo inválido');
      if (pigeon.retired) throw new BadRequestException('Pombo aposentado não pode ser escolhido');
      if (pigeon.maxDistanceKm && data.distanceKm && data.distanceKm > pigeon.maxDistanceKm) {
        throw new BadRequestException('Distância maior que o alcance do pombo');
      }
    }

  
const history: StatusHistoryEntry[] = [
  {
    status: LetterStatus.NA_FILA,
    date: this.nowStr(),
    changes: [],
    messages: []
  }
];

    const l = this.repo.create({
      content: data.content,
      address: data.address,
      recipient,
      sender,
      pigeon,
      status: LetterStatus.NA_FILA,
      distanceKm: data.distanceKm || null,
      eta: this.calcEta(pigeon, data.distanceKm),
      priority: data.priority || Priority.NORMAL,
      statusHistory: history
    });

    return this.repo.save(l);
  }

  async update(id: string, data: UpdateLetterDto) {
    const letter = await this.repo.findOne({
      where: { id },
      relations: ['pigeon']
    });

    if (!letter) throw new NotFoundException('Carta não encontrada');

    if (data.status && !Object.values(LetterStatus).includes(data.status)) {
      throw new BadRequestException('Status inválido');
    }

    if (letter.status === LetterStatus.ENTREGUE && data.status && data.status !== LetterStatus.ENTREGUE) {
      throw new BadRequestException('Carta já entregue; status não pode ser alterado');
    }

    if (data.pigeonId) {
      const pigeon = await this.pigeonsRepo.findOneBy({ id: data.pigeonId });
      if (!pigeon) throw new BadRequestException('Pombo inválido');
      if (pigeon.retired) throw new BadRequestException('Pombo aposentado não pode ser escolhido');
      if (pigeon.maxDistanceKm && (data.distanceKm || letter.distanceKm) > pigeon.maxDistanceKm) {
        throw new BadRequestException('Distância maior que o alcance do pombo');
      }
      letter.pigeon = pigeon;
      letter.eta = this.calcEta(pigeon, data.distanceKm || letter.distanceKm);
    }

    // Array para registrar mudanças
    const changes: { field: string; oldValue: any; newValue: any; message?: string }[] = [];

    if (data.content !== undefined && data.content !== letter.content) {
      changes.push({
        field: 'content',
        oldValue: letter.content,
        newValue: data.content,
        message: `Conteúdo alterado: "${data.content}"`
      });
      letter.content = data.content;
    }

    if (data.address !== undefined && data.address !== letter.address) {
      changes.push({
        field: 'address',
        oldValue: letter.address,
        newValue: data.address,
        message: `Endereço alterado: "${data.address}"`
      });
      letter.address = data.address;
    }

    if (data.distanceKm !== undefined && data.distanceKm !== letter.distanceKm) {
      changes.push({
        field: 'distanceKm',
        oldValue: letter.distanceKm,
        newValue: data.distanceKm,
        message: `Distância alterada: ${letter.distanceKm}km → ${data.distanceKm}km`
      });
      letter.distanceKm = data.distanceKm;
    }

    if (data.priority !== undefined && data.priority !== letter.priority) {
      changes.push({
        field: 'priority',
        oldValue: letter.priority,
        newValue: data.priority,
        message: `Prioridade alterada: ${letter.priority} → ${data.priority}`
      });
      letter.priority = data.priority;
    }

    if (data.status && data.status !== letter.status) {
      changes.push({
        field: 'status',
        oldValue: letter.status,
        newValue: data.status,
        message: `Status alterado: ${letter.status} → ${data.status}`
      });
      letter.status = data.status;

      if (data.status === LetterStatus.ENTREGUE && letter.pigeon) {
        await this.pigeonsRepo.increment({ id: letter.pigeon.id }, 'deliveriesCount', 1);
      }
    }

    // Adiciona no histórico mantendo tipo correto
    if (changes.length > 0) {
      letter.statusHistory = [
        ...(letter.statusHistory || []),
        {
          status: letter.status,
          date: this.nowStr(),
          changes,
          messages: changes.map(c => c.message).filter(Boolean)
        }
      ];
    }

    return this.repo.save(letter);
  }

  async setSignature(id: string, path: string) {
    const l = await this.findOne(id);
    l.recipientSignature = path;
    return this.repo.save(l);
  }
}
