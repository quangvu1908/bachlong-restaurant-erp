import { z } from "zod"

export const dishSchema = z.object({
  name: z.string().trim().min(1, "Tên món ăn không được để trống"),
  categoryId: z.string().trim().min(1, "Chọn danh mục"),
  price: z.coerce.number().min(0, "Giá bán phải lớn hơn hoặc bằng 0"),
  isActive: z.boolean(),
})

export type DishInput = z.infer<typeof dishSchema>
