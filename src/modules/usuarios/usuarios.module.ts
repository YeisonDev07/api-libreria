import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  providers: [UsuariosService],
  controllers: [UsuariosController],
  imports: [PrismaModule],
  exports: [UsuariosService],
})
export class UsuariosModule {}
