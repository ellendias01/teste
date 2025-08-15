import { MethodNotAllowedException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { PigeonsModule } from './pigeons/pigeons.module';
import { ClientsModule } from './clients/clients.module';
import { LettersModule } from './letters/letters.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data.sqlite'),
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 3000
    }),
    PigeonsModule,
    ClientsModule,
    LettersModule
  ]
})
export class AppModule {}
