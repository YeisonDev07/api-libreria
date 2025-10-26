// Servicio para gestionar operaciones relacionadas con usuarios

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ActualizarUsuarioDto, CrearUsuarioDto } from './dto';

interface ObtenerUsuariosOptions {
  page?: number;
  limit?: number;
  nombre?: string;
  correo?: string;
  edad?: number;
}
@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async obtenerTodos(options: ObtenerUsuariosOptions = {}) {
    const { page = 1, limit = 10, nombre, correo, edad } = options;
    const where: any = {};

    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
    if (correo) where.correo = { contains: correo, mode: 'insensitive' };
    if (edad) where.edad = { equals: edad };

    const usuarios = await this.prisma.usuario.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalUsuarios = await this.prisma.usuario.count({ where });

    // transformamos a UsuarioRespuestaDto
    const data = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      edad: u.edad,
    }));

    return {
      respuesta: {
        totalUsuarios,
        paginaActual: page,
        ultimaPagina: Math.ceil(totalUsuarios / limit),
      },
      data,
    };
  }

  async obtenerPorId(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async crearUsuario(data: CrearUsuarioDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { correo: data.correo },
    });
    if (existingUser) {
      throw new ConflictException(
        `El correo ${data.correo} ya está registrado.`,
      );
    }
    return await this.prisma.usuario.create({ data });
  }

  async actualizarUsuario(id: number, data: ActualizarUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (data.correo) {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { correo: data.correo },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `El correo ${data.correo} ya está registrado.`,
        );
      }
    }

    return await this.prisma.usuario.update({ where: { id }, data });
  }

  async eliminarUsuario(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    try {
      return await this.prisma.usuario.delete({ where: { id } });
    } catch {
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }

  async obtenerPorIdConPrestamos(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        prestamos: {
          include: {
            ejemplar: {
              include: {
                libro: true, // trae el libro relacionado con el ejemplar
              },
            },
          },
        },
      },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Transformamos null -> undefined para fechaFin
    const prestamosTransformados = usuario.prestamos.map((p) => ({
      ...p,
      fechaFin: p.fechaFin ?? undefined,
      ejemplar: {
        ...p.ejemplar,
        libro: p.ejemplar.libro,
      },
    }));

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad,
      prestamos: prestamosTransformados,
    };
  }
}
