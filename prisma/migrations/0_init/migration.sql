-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "username" TEXT,
    "role" TEXT DEFAULT 'user',
    "isHourlyUpdateEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isDailyUpdateEnabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

