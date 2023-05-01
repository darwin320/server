-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(280) NOT NULL,
    `lastName` VARCHAR(280) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(280) NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Api` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Api_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApisOnRoles` (
    `apiId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `get` BOOLEAN NOT NULL DEFAULT false,
    `post` BOOLEAN NOT NULL DEFAULT false,
    `delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`apiId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameService` VARCHAR(50) NOT NULL,
    `typeService` ENUM('type1', 'type2', 'type3') NOT NULL,
    `nameSupplier` VARCHAR(50) NOT NULL,
    `company` VARCHAR(50) NOT NULL,
    `phoneNumber` VARCHAR(200) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `nameClient` VARCHAR(200) NOT NULL,
    `salon` ENUM('interior', 'exterior') NOT NULL,
    `cantidadAdultos` INTEGER NOT NULL,
    `cantidadNinos` INTEGER NOT NULL,
    `fecha` VARCHAR(191) NOT NULL,
    `fechaFin` VARCHAR(191) NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `horaFin` DATETIME(3) NOT NULL,
    `tipoEvento` ENUM('boda', 'quinceanera', 'cumpleanos', 'graduacion', 'otro') NOT NULL,
    `downPayment` DOUBLE NOT NULL,
    `priceRoomPerHour` DOUBLE NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservacionId` INTEGER NOT NULL,

    UNIQUE INDEX `Inventory_reservacionId_key`(`reservacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_InventoryToService` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_InventoryToService_AB_unique`(`A`, `B`),
    INDEX `_InventoryToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApisOnRoles` ADD CONSTRAINT `ApisOnRoles_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApisOnRoles` ADD CONSTRAINT `ApisOnRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_reservacionId_fkey` FOREIGN KEY (`reservacionId`) REFERENCES `Reservacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InventoryToService` ADD CONSTRAINT `_InventoryToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `Inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InventoryToService` ADD CONSTRAINT `_InventoryToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
