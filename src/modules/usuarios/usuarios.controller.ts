import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsuariosService } from 'src/modules/usuarios';
import {
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  UsuarioConPrestamosDto,
} from 'src/modules/usuarios/dto';

@Controller('usuario')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Get()
  obtenerUsuarios(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('nombre') nombre: string,
    @Query('correo') correo: string,
    @Query('edad') edad: string,
  ) {
    return this.usuarioService.obtenerTodos({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      nombre,
      correo,
      edad: edad ? Number(edad) : undefined,
    });
  }

  @Get(':id')
  obtenerUsuarioPorId(@Param('id') id: string) {
    return this.usuarioService.obtenerPorId(Number(id));
  }

  @Post()
  crearUsuario(@Body() data: CrearUsuarioDto) {
    return this.usuarioService.crearUsuario(data);
  }

  @Put(':id')
  actualizarUsuario(
    @Param('id') id: string,
    @Body() data: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.actualizarUsuario(Number(id), data);
  }

  @Delete(':id')
  eliminarUsuario(@Param('id') id: string) {
    return this.usuarioService.eliminarUsuario(Number(id));
  }

  @Get(':id/prestamos')
  obtenerUsuarioConPrestamos(
    @Param('id') id: string,
  ): Promise<UsuarioConPrestamosDto> {
    return this.usuarioService.obtenerPorIdConPrestamos(Number(id));
  }
}
