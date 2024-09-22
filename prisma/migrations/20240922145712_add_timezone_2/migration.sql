/*
  Warnings:

  - Made the column `utcOffset` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" BIGINT NOT NULL,
    "username" TEXT,
    "role" TEXT DEFAULT 'user',
    "isHourlyUpdateEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isDailyUpdateEnabled" BOOLEAN NOT NULL DEFAULT false,
    "utcOffset" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "isDailyUpdateEnabled", "isHourlyUpdateEnabled", "role", "username", "utcOffset") SELECT "id", "isDailyUpdateEnabled", "isHourlyUpdateEnabled", "role", "username", "utcOffset" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
