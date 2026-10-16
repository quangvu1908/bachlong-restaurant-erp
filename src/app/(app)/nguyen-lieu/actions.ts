"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toActionError } from "@/lib/action-error"
import { ingredientSchema, type IngredientInput } from "./schema"

export async function createIngredient(input: IngredientInput) {
  const data = ingredientSchema.parse(input)
  try {
    await prisma.ingredient.create({ data })
    revalidatePath("/nguyen-lieu")
    revalidatePath("/nhap-xuat-kho")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể tạo nguyên liệu")
  }
}

export async function updateIngredient(id: string, input: IngredientInput) {
  const data = ingredientSchema.parse(input)
  try {
    await prisma.ingredient.update({ where: { id }, data })
    revalidatePath("/nguyen-lieu")
    revalidatePath("/nhap-xuat-kho")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể cập nhật nguyên liệu")
  }
}

export async function deleteIngredient(id: string) {
  try {
    await prisma.ingredient.delete({ where: { id } })
    revalidatePath("/nguyen-lieu")
    revalidatePath("/nhap-xuat-kho")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể xoá nguyên liệu")
  }
}
