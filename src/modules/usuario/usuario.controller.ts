import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioService } from 'src/modules/usuario';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  obtenerUsuarios() {
    return this.usuarioService.obtenerTodos();
  }

  @Get(':id')
  obtenerUsuarioPorId(@Param('id') id: string) {
    return this.usuarioService.obtenerPorId(Number(id));
  }

  @Post()
  crearUsuario(@Body() data: { nombre: string; correo: string; edad: number }) {
    return this.usuarioService.crearUsuario(data);
  }

  @Put(':id')
  actualizarUsuario(
    @Param('id') id: string,
    @Body() data: { nombre?: string; correo?: string; edad?: number },
  ) {
    return this.usuarioService.actualizarUsuario(Number(id), data);
  }

  @Delete(':id')
  eliminarUsuario(@Param('id') id: string) {
    return this.usuarioService.eliminarUsuario(Number(id));
  }
}
