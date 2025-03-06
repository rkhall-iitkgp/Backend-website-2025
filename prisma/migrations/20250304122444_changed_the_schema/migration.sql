/*
  Warnings:

  - A unique constraint covering the columns `[email_id]` on the table `tempusers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tempusers_email_id_key" ON "tempusers"("email_id");
