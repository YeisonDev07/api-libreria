// Registra el servicio como módulo NestJS.

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hace que el módulo sea global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
