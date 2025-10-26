// Servicio para gestionar operaciones relacionadas con usuarios

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async obtenerTodos() {
    return this.prisma.usuario.findMany();
  }

  async obtenerPorId(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async crearUsuario(data: { nombre: string; correo: string; edad: number }) {
    try {
      return await this.prisma.usuario.create({ data });
    } catch {
      throw new BadRequestException('No se pudo crear el usuario');
    }
  }

  async actualizarUsuario(
    id: number,
    data: { nombre?: string; correo?: string; edad?: number },
  ) {
    try {
      return await this.prisma.usuario.update({ where: { id }, data });
    } catch {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }
  }

  async eliminarUsuario(id: number) {
    try {
      return await this.prisma.usuario.delete({ where: { id } });
    } catch {
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }
}
