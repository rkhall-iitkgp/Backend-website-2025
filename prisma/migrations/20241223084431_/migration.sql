-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "institute_roll_number" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "year_of_passing" INTEGER NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "institute_email_id" VARCHAR(100),
    "date_of_birth" DATE NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "emergency_mobile_number" VARCHAR(15),
    "room_number" VARCHAR(10),
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" VARCHAR(6),
    "verificationExpires" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_institute_roll_number_key" ON "users"("institute_roll_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_id_key" ON "users"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_institute_email_id_key" ON "users"("institute_email_id");
