import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CrearUsuarioDto, ActualizarUsuarioDto, UsuarioConPrestamosDto } from './dto';

interface ObtenerUsuariosOptions {
  page?: number;
  limit?: number;
  nombre?: string;
  correo?: string;
  edad?: number;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private prisma: PrismaService) {}

  async obtenerTodos(options: ObtenerUsuariosOptions = {}) {
    const { page = 1, limit = 10, nombre, correo, edad } = options;
    const where: any = {};
    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
    if (correo) where.correo = { contains: correo, mode: 'insensitive' };
    if (edad) where.edad = { equals: edad };

    this.logger.log(`Obteniendo usuarios con filtros: ${JSON.stringify(where)}, page: ${page}, limit: ${limit}`);

    const usuarios = await this.prisma.usuario.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalUsuarios = await this.prisma.usuario.count({ where });
    const data = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      edad: u.edad,
    }));

    this.logger.log(`Usuarios obtenidos: ${data.length} de ${totalUsuarios} totales`);

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
    this.logger.log(`Obteniendo usuario por id: ${id}`);
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async crearUsuario(data: CrearUsuarioDto) {
    this.logger.log(`Intentando crear usuario con correo: ${data.correo}`);
    const existingUser = await this.prisma.usuario.findUnique({ where: { correo: data.correo } });
    if (existingUser) {
      this.logger.warn(`Correo duplicado detectado: ${data.correo}`);
      throw new ConflictException(`El correo ${data.correo} ya está registrado.`);
    }
    const usuario = await this.prisma.usuario.create({ data });
    this.logger.log(`Usuario creado con id: ${usuario.id}`);
    return usuario;
  }

  async actualizarUsuario(id: number, data: ActualizarUsuarioDto) {
    this.logger.log(`Intentando actualizar usuario id: ${id}`);
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }

    if (data.correo) {
      const existingUser = await this.prisma.usuario.findUnique({ where: { correo: data.correo } });
      if (existingUser && existingUser.id !== id) {
        this.logger.warn(`Correo duplicado al actualizar: ${data.correo}`);
        throw new ConflictException(`El correo ${data.correo} ya está registrado.`);
      }
    }

    const updated = await this.prisma.usuario.update({ where: { id }, data });
    this.logger.log(`Usuario actualizado con id: ${id}`);
    return updated;
  }

  async eliminarUsuario(id: number) {
    this.logger.log(`Intentando eliminar usuario id: ${id}`);
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado para eliminar: ${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }
    try {
      const deleted = await this.prisma.usuario.delete({ where: { id } });
      this.logger.log(`Usuario eliminado con id: ${id}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Error eliminando usuario id: ${id}`, error.stack);
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }

  async obtenerPorIdConPrestamos(id: number): Promise<UsuarioConPrestamosDto> {
    this.logger.log(`Obteniendo usuario con préstamos id: ${id}`);
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { prestamos: { include: { ejemplar: { include: { libro: true } } } } },
    });
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado para préstamos: ${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.log(`Usuario con préstamos obtenido: ${id}, total prestamos: ${usuario.prestamos.length}`);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad,
      prestamos: usuario.prestamos.map((p) => ({
        id: p.id,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin ?? null,
        devuelto: p.devuelto,
        ejemplar: {
          id: p.ejemplar.id,
          disponible: p.ejemplar.disponible,
          libro: { id: p.ejemplar.libro.id, titulo: p.ejemplar.libro.titulo, autor: p.ejemplar.libro.autor },
        },
      })),
    };
  }
}
