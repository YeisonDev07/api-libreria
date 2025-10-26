import { ApiProperty } from '@nestjs/swagger';

export class UsuarioRespuestaDto {
  @ApiProperty() id: number;
  @ApiProperty() nombre: string;
  @ApiProperty() correo: string;
  @ApiProperty() edad: number;
}