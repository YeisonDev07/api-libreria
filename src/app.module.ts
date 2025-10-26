import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UsuarioModule } from './modules/usuarios/usuarios.module';

@Module({
  imports: [PrismaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
