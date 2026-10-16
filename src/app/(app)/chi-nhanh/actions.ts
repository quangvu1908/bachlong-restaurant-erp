"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toActionError } from "@/lib/action-error"
import { branchSchema, type BranchInput } from "./schema"

export async function createBranch(input: BranchInput) {
  const data = branchSchema.parse(input)
  try {
    await prisma.branch.create({ data })
    revalidatePath("/chi-nhanh")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể tạo chi nhánh")
  }
}

export async function updateBranch(id: string, input: BranchInput) {
  const data = branchSchema.parse(input)
  try {
    await prisma.branch.update({ where: { id }, data })
    revalidatePath("/chi-nhanh")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể cập nhật chi nhánh")
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({ where: { id } })
    revalidatePath("/chi-nhanh")
    revalidatePath("/tong-quan")
  } catch (error) {
    throw toActionError(error, "Không thể xoá chi nhánh")
  }
}
