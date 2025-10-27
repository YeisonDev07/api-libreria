import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { LibrosModule } from './modules/libros';

@Module({
  imports: [PrismaModule, UsuariosModule, LibrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
