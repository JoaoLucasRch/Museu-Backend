ALTER TABLE `eventos` DROP COLUMN `edital_ativa`,
    DROP COLUMN `edital_categoria`,
    ADD COLUMN `eh_edital` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `fim_submissao` DATETIME(3) NULL,
    ADD COLUMN `inicio_submissao` DATETIME(3) NULL,
    MODIFY `local_evento` VARCHAR(191) NOT NULL DEFAULT 'Museu',
    MODIFY `tipo_evento` ENUM('EXPOSICAO', 'OFICINA', 'PALESTRA', 'LANCAMENTO', 'OUTRO') NOT NULL;

-- RenameIndex
ALTER TABLE `eventos` RENAME INDEX `eventos_criado_por_id_fkey` TO `eventos_criado_por_id_idx`;

-- RenameIndex
ALTER TABLE `obras` RENAME INDEX `obras_artista_id_fkey` TO `obras_artista_id_idx`;

-- RenameIndex
ALTER TABLE `obras` RENAME INDEX `obras_edital_id_fkey` TO `obras_edital_id_idx`;
