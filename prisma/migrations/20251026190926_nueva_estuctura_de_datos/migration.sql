/*
  Warnings:

  - You are about to drop the `_UsuarioLibros` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualizadoEn` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_UsuarioLibros" DROP CONSTRAINT "_UsuarioLibros_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UsuarioLibros" DROP CONSTRAINT "_UsuarioLibros_B_fkey";

-- AlterTable
ALTER TABLE "Libro" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."_UsuarioLibros";

-- CreateTable
CREATE TABLE "Ejemplar" (
    "id" SERIAL NOT NULL,
    "libroId" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ejemplar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ejemplarId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "devuelto" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ejemplar" ADD CONSTRAINT "Ejemplar_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_ejemplarId_fkey" FOREIGN KEY ("ejemplarId") REFERENCES "Ejemplar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
