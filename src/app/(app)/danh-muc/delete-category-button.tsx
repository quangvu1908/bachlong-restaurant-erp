"use client"

import { ConfirmDeleteButton } from "@/components/confirm-delete-button"
import { deleteCategory } from "./actions"

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDeleteButton
      title={`Xoá danh mục "${name}"?`}
      description="Chỉ có thể xoá khi danh mục chưa có nguyên liệu/món ăn nào."
      onConfirm={() => deleteCategory(id)}
    />
  )
}
