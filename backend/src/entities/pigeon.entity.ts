import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum HealthStatus {
  ACTIVE = 'ACTIVE',
  REST = 'REST',
  TREATMENT = 'TREATMENT'
}

@Entity()
export class Pigeon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nickname: string;

  @Column('float', { nullable: true })
  averageSpeed: number;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  retired: boolean;

  @Column({ nullable: true })
  age: string; // e.g. "2 years"

  @Column('float', { nullable: true })
  maxDistanceKm: number;

  @Column({ type: 'text', nullable: true })
  healthStatus: HealthStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 0 })
  deliveriesCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
