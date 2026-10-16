"use client"

import { ConfirmDeleteButton } from "@/components/confirm-delete-button"
import { deleteDish } from "./actions"

export function DeleteDishButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDeleteButton
      title={`Xoá món ăn "${name}"?`}
      onConfirm={() => deleteDish(id)}
    />
  )
}
