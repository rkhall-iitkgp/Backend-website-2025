/*
  Warnings:

  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verificationExpires` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isVerified",
DROP COLUMN "verificationCode",
DROP COLUMN "verificationExpires";

-- CreateTable
CREATE TABLE "tempusers" (
    "id" SERIAL NOT NULL,
    "rk_id" VARCHAR(8) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "institute_roll_number" VARCHAR(9) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "year_of_passing" INTEGER NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "institute_email_id" VARCHAR(100),
    "date_of_birth" DATE NOT NULL,
    "department" "Department" NOT NULL,
    "emergency_mobile_number" VARCHAR(10),
    "room_number" VARCHAR(10),
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" VARCHAR(6),
    "verificationExpires" TIMESTAMP(3),

    CONSTRAINT "tempusers_pkey" PRIMARY KEY ("id")
);
