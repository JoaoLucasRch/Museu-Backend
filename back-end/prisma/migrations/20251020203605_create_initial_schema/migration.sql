-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `contato` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'ARTISTA') NOT NULL DEFAULT 'ARTISTA',

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obras` (
    `id_obra` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo_obra` VARCHAR(191) NOT NULL,
    `descricao_obra` VARCHAR(191) NULL,
    `imagens_obras` VARCHAR(191) NULL,
    `categoria_obra` VARCHAR(191) NOT NULL,
    `status` ENUM('pendente', 'aprovada', 'rejeitada', 'exposta') NOT NULL DEFAULT 'pendente',
    `data_envio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_exposicao` DATETIME(3) NULL,
    `data_fim_exposicao` DATETIME(3) NULL,
    `artista_id` INTEGER NOT NULL,

    PRIMARY KEY (`id_obra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id_evento` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo_evento` VARCHAR(191) NOT NULL,
    `descricao_evento` VARCHAR(191) NOT NULL,
    `local_evento` VARCHAR(191) NOT NULL,
    `imagem_evento` VARCHAR(191) NULL,
    `data_hora_inicio` DATETIME(3) NOT NULL,
    `data_hora_fim` DATETIME(3) NOT NULL,
    `tipo_evento` ENUM('EXPOSICAO', 'OFICINA', 'PALESTRA', 'LANCAMENTO', 'OUTRO') NOT NULL,
    `criado_por_id` INTEGER NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_evento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `obras` ADD CONSTRAINT `obras_artista_id_fkey` FOREIGN KEY (`artista_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_criado_por_id_fkey` FOREIGN KEY (`criado_por_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
