import { ApiProperty } from '@nestjs/swagger';

class LibroDto {
  @ApiProperty() id: number;
  @ApiProperty() titulo: string;
  @ApiProperty() autor: string;
}

class EjemplarDto {
  @ApiProperty() id: number;
  @ApiProperty() disponible: boolean;
  @ApiProperty({ type: LibroDto }) libro: LibroDto;
}

class PrestamoDto {
  @ApiProperty() id: number;
  @ApiProperty() fechaInicio: Date;
  @ApiProperty({ nullable: true }) fechaFin: Date | null;
  @ApiProperty() devuelto: boolean;
  @ApiProperty({ type: EjemplarDto }) ejemplar: EjemplarDto;
}

export class UsuarioConPrestamosDto {
  @ApiProperty() id: number;
  @ApiProperty() nombre: string;
  @ApiProperty() correo: string;
  @ApiProperty() edad: number;
  @ApiProperty({ type: [PrestamoDto] }) prestamos: PrestamoDto[];
}
