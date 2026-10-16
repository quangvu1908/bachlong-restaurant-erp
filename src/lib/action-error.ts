import { Prisma } from "@prisma/client";

export function toActionError(error: unknown, fallback: string): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return new Error("Dữ liệu đã tồn tại, vui lòng kiểm tra lại mã/tên.");
    if (error.code === "P2003" || error.code === "P2014") {
      return new Error("Không thể xoá vì dữ liệu này đang được sử dụng ở nơi khác.");
    }
  }
  if (error instanceof Error) return error;
  return new Error(fallback);
}
