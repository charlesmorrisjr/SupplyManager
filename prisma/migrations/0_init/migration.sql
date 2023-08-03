-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "completion" SMALLINT NOT NULL DEFAULT 0,
    "orderfiller_id" INTEGER,
    "weight" DECIMAL(4,2) NOT NULL DEFAULT 1,
    "route" SMALLINT NOT NULL DEFAULT 0,
    "stop" SMALLINT NOT NULL DEFAULT 0,
    "total_cases" SMALLINT NOT NULL DEFAULT 1,
    "cases_picked" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

