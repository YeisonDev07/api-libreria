-- CreateTable
CREATE TABLE "_UsuarioLibros" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioLibros_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UsuarioLibros_B_index" ON "_UsuarioLibros"("B");

-- AddForeignKey
ALTER TABLE "_UsuarioLibros" ADD CONSTRAINT "_UsuarioLibros_A_fkey" FOREIGN KEY ("A") REFERENCES "Libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioLibros" ADD CONSTRAINT "_UsuarioLibros_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
