"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toActionError } from "@/lib/action-error"
import { stockMovementSchema, type StockMovementInput } from "./schema"

export async function createStockMovement(input: StockMovementInput) {
  const data = stockMovementSchema.parse(input)

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.stockLevel.findUnique({
        where: { branchId_ingredientId: { branchId: data.branchId, ingredientId: data.ingredientId } },
      })

      const currentQty = current?.quantity ?? 0
      const nextQty = data.type === "IN" ? currentQty + data.quantity : currentQty - data.quantity

      if (nextQty < 0) {
        throw new Error("Không đủ tồn kho để xuất. Vui lòng kiểm tra lại số lượng.")
      }

      await tx.stockLevel.upsert({
        where: { branchId_ingredientId: { branchId: data.branchId, ingredientId: data.ingredientId } },
        create: { branchId: data.branchId, ingredientId: data.ingredientId, quantity: nextQty },
        update: { quantity: nextQty },
      })

      await tx.stockMovement.create({
        data: {
          branchId: data.branchId,
          ingredientId: data.ingredientId,
          type: data.type,
          quantity: data.quantity,
          note: data.note || null,
        },
      })
    })

    revalidatePath("/nhap-xuat-kho")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể lưu phiếu kho")
  }
}
