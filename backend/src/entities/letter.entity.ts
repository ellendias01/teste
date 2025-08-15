import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Pigeon } from './pigeon.entity';
import { Client } from './client.entity';

export enum LetterStatus {
  NA_FILA = 'NA_FILA',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE'
}

export enum Priority {
  NORMAL = 'NORMAL',
  URGENTE = 'URGENTE'
}

export interface StatusHistoryEntry {
  status: LetterStatus;
  date: string;
  changes?: { field: string; oldValue: any; newValue: any; message?: string }[];
  messages?: string[];
}

@Entity()
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column()
  address: string;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: Client;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: Client;

  @ManyToOne(() => Pigeon, { eager: true, nullable: true })
  @JoinColumn({ name: 'pigeonId' })
  pigeon: Pigeon | null;

  @Column({ type: 'text', default: LetterStatus.NA_FILA })
  status: LetterStatus;

  @Column({ type: 'real', nullable: true })
  distanceKm: number;

  @Column({ nullable: true })
  eta: string;

  @Column({ type: 'text', default: Priority.NORMAL })
  priority: Priority;

  // Usando simple-json e removendo default
  @Column({ type: 'simple-json', nullable: true })
  statusHistory: StatusHistoryEntry[];

  @Column({ nullable: true })
  recipientSignature: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
