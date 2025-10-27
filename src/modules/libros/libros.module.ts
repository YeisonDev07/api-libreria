import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { PrismaModule } from "src/prisma";

@Module({
  controllers: [LibrosController],
  providers: [LibrosService],
  imports: [PrismaModule],
  exports: [LibrosService],
})
export class LibrosModule {}
