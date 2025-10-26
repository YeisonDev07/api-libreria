// Define y configura la instancia de Prisma Client. 
// Se encarga de la conexión y desconexión a la base de datos

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// Servicio de Prisma que se inicializa con el módulo
// Hereda el cliente Prisma con todos sus métodos
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Se conecta a la base de datos al iniciar el módulo
  async onModuleInit() {
    // Abre conexión a la DB antes de continuar
    await this.$connect();
  }

  // Maneja el cierre adecuado de la conexión a la base de datos
  async enableShutdownHooks(app: INestApplication) {
    // Evento antes de que PrismaClient se cierre
    (this as any).$on('beforeExit', async () => {
      // Cierra la aplicación NestJS
      await app.close();
    });
  }
}
