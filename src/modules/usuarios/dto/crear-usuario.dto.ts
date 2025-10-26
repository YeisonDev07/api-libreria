import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CrearUsuarioDto {
  @ApiProperty({
    example: 'Yeison Gil Alzate',
    description: 'Nombre completo del usuario',
  })
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @Length(2, 50)
  nombre: string;

  @ApiProperty({
    example: 'yeison@gmail.com',
    description: 'Correo electrónico único del usuario',
  })
  @IsEmail()
  correo: string;

  @ApiProperty({
    description: 'Edad del usuario',
    example: 24,
    minimum: 10,
    maximum: 90,
  })
  @IsInt()
  @Min(10)
  @Max(90)
  @IsPositive()
  edad: number;
}
