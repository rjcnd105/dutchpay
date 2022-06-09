/*
  Warnings:

  - Added the required column `payerId` to the `PayItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PayItem" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "payerId" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DebtorForItem" (
    "payItemId" INTEGER NOT NULL,
    "debtorIds" INTEGER NOT NULL,
    "extraAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DebtorForItem_pkey" PRIMARY KEY ("payItemId","debtorIds")
);

-- AddForeignKey
ALTER TABLE "PayItem" ADD CONSTRAINT "PayItem_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Payer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtorForItem" ADD CONSTRAINT "DebtorForItem_payItemId_fkey" FOREIGN KEY ("payItemId") REFERENCES "PayItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
