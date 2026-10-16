import { z } from "zod"

export const movementTypes = ["IN", "OUT"] as const
export type MovementType = (typeof movementTypes)[number]

export const movementTypeLabel: Record<MovementType, string> = {
  IN: "Nhập kho",
  OUT: "Xuất kho",
}

export const stockMovementSchema = z.object({
  branchId: z.string().trim().min(1, "Chọn chi nhánh"),
  ingredientId: z.string().trim().min(1, "Chọn nguyên liệu"),
  type: z.enum(movementTypes, { message: "Chọn loại phiếu" }),
  quantity: z.coerce.number().positive("Số lượng phải lớn hơn 0"),
  note: z.string().trim().max(500).optional(),
})

export type StockMovementInput = z.infer<typeof stockMovementSchema>
