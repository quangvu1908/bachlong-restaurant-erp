import { z } from "zod"

export const categoryKinds = ["INGREDIENT", "DISH"] as const
export type CategoryKind = (typeof categoryKinds)[number]

export const categoryKindLabel: Record<CategoryKind, string> = {
  INGREDIENT: "Nguyên liệu",
  DISH: "Món ăn",
}

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Tên danh mục không được để trống"),
  kind: z.enum(categoryKinds, { message: "Chọn loại danh mục" }),
  isActive: z.boolean(),
})

export type CategoryInput = z.infer<typeof categorySchema>
