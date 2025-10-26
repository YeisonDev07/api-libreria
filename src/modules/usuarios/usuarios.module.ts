import { Module } from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import { UsuarioController } from './usuarios.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  providers: [UsuarioService],
  controllers: [UsuarioController],
  imports: [PrismaModule],
  exports: [UsuarioService],
})
export class UsuarioModule {}
