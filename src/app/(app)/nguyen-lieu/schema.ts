import { z } from "zod"

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, "Tên nguyên liệu không được để trống"),
  categoryId: z.string().trim().min(1, "Chọn danh mục"),
  unit: z.string().trim().min(1, "Đơn vị tính không được để trống"),
  unitPrice: z.coerce.number().min(0, "Đơn giá phải lớn hơn hoặc bằng 0"),
  minStock: z.coerce.number().min(0, "Tồn tối thiểu phải lớn hơn hoặc bằng 0"),
  isActive: z.boolean(),
})

export type IngredientInput = z.infer<typeof ingredientSchema>
