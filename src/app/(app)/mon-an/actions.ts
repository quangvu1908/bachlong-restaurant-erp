"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toActionError } from "@/lib/action-error"
import { dishSchema, type DishInput } from "./schema"

export async function createDish(input: DishInput) {
  const data = dishSchema.parse(input)
  try {
    await prisma.dish.create({ data })
    revalidatePath("/mon-an")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể tạo món ăn")
  }
}

export async function updateDish(id: string, input: DishInput) {
  const data = dishSchema.parse(input)
  try {
    await prisma.dish.update({ where: { id }, data })
    revalidatePath("/mon-an")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể cập nhật món ăn")
  }
}

export async function deleteDish(id: string) {
  try {
    await prisma.dish.delete({ where: { id } })
    revalidatePath("/mon-an")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể xoá món ăn")
  }
}
