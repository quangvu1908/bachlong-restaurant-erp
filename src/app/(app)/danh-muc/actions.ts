"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toActionError } from "@/lib/action-error"
import { categorySchema, type CategoryInput } from "./schema"

export async function createCategory(input: CategoryInput) {
  const data = categorySchema.parse(input)
  try {
    await prisma.category.create({ data })
    revalidatePath("/danh-muc")
  } catch (error) {
    throw toActionError(error, "Không thể tạo danh mục")
  }
}

export async function updateCategory(id: string, input: CategoryInput) {
  const data = categorySchema.parse(input)
  try {
    await prisma.category.update({ where: { id }, data })
    revalidatePath("/danh-muc")
  } catch (error) {
    throw toActionError(error, "Không thể cập nhật danh mục")
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath("/danh-muc")
  } catch (error) {
    throw toActionError(error, "Không thể xoá danh mục")
  }
}
