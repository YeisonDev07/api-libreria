import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from "src/prisma";

@Module({
  providers: [UsuarioService],
  controllers: [UsuarioController],
  imports: [PrismaModule],
  exports: [UsuarioService],
})
export class UsuarioModule {}
