"use client"

import { ConfirmDeleteButton } from "@/components/confirm-delete-button"
import { deleteBranch } from "./actions"

export function DeleteBranchButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDeleteButton
      title={`Xoá chi nhánh "${name}"?`}
      description="Chỉ có thể xoá khi chi nhánh chưa có phiếu nhập/xuất kho."
      onConfirm={() => deleteBranch(id)}
    />
  )
}
