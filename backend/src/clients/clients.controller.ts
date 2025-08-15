import { Controller, Get, Post, Body, Param, Put, BadRequestException } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private svc: ClientsService) {}

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
    const { name, email } = body;
    if (!name || !email) throw new BadRequestException('name and email required');
    return this.svc.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    const { name, email } = body;
    if (!name || !email) throw new BadRequestException('name and email required');
    return this.svc.update(id, body);
  }
}
