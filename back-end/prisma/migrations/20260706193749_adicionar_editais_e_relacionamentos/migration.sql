ALTER TABLE `eventos` ADD COLUMN `edital_ativa` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `edital_categoria` VARCHAR(191) NULL,
    MODIFY `tipo_evento` ENUM('EXPOSICAO', 'OFICINA', 'PALESTRA', 'LANCAMENTO', 'EDITAL', 'OUTRO') NOT NULL;

ALTER TABLE `obras` ADD COLUMN `edital_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `obras` ADD CONSTRAINT `obras_edital_id_fkey` FOREIGN KEY (`edital_id`) REFERENCES `eventos`(`id_evento`) ON DELETE SET NULL ON UPDATE CASCADE;
