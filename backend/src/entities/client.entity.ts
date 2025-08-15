import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pigeon } from './pigeon.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  address: string;
  
  @Column({ nullable: true })
  number: string; 
  
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  complement: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column({ nullable: true, name: 'favoritePigeonId' })
  favoritePigeonId: string | null;

  @ManyToOne(() => Pigeon, { nullable: true, eager: true })
  @JoinColumn({ name: 'favoritePigeonId' })
  favoritePigeon: Pigeon | null;

  @CreateDateColumn()
  createdAt: Date;
}