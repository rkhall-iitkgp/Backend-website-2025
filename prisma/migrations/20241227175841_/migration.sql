/*
  Warnings:

  - You are about to alter the column `institute_roll_number` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(9)`.
  - You are about to alter the column `phone_number` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(10)`.
  - You are about to alter the column `emergency_mobile_number` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(10)`.
  - A unique constraint covering the columns `[rk_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rk_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `department` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('AE', 'AG', 'AR', 'BT', 'CE', 'CH', 'CS', 'CY', 'EE', 'EC', 'EX', 'GG', 'HS', 'IM', 'MA', 'ME', 'MI', 'MT', 'NA', 'PH');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rk_id" VARCHAR(8) NOT NULL,
ALTER COLUMN "institute_roll_number" SET DATA TYPE VARCHAR(9),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(10),
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL,
ALTER COLUMN "emergency_mobile_number" SET DATA TYPE VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "users_rk_id_key" ON "users"("rk_id");
