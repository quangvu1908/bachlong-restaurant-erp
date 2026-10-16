import { z } from "zod"

export const branchSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Mã chi nhánh không được để trống")
    .max(20, "Mã chi nhánh tối đa 20 ký tự"),
  name: z.string().trim().min(1, "Tên chi nhánh không được để trống"),
  address: z.string().trim().optional(),
  isActive: z.boolean(),
})

export type BranchInput = z.infer<typeof branchSchema>
