"use client"

import { ConfirmDeleteButton } from "@/components/confirm-delete-button"
import { deleteIngredient } from "./actions"

export function DeleteIngredientButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDeleteButton
      title={`Xoá nguyên liệu "${name}"?`}
      description="Chỉ có thể xoá khi nguyên liệu chưa có lịch sử nhập/xuất kho."
      onConfirm={() => deleteIngredient(id)}
    />
  )
}
