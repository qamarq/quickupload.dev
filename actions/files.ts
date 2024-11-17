"use server"

import { FileType } from "@/constants";
import { prisma } from "@/lib/db"

const CURL_COMMAND_SKELETON = `curl -X "POST" "${process.env.NEXT_PUBLIC_URL}/api/v1/upload" -H "accept: application/json" -H "Content-Type: multipart/form-data" -H "x-access-token: %a" -F "file=@%b;type=%c"`

export const generateNewFile = async ({ fileName, fileType }: {
  fileName: string;
  fileType: FileType;
}) => {
  const file = await prisma.file.create({
    data: {
      name: fileName + fileType.extension,
      type: fileType.type
    }
  })

  return {
    curl: CURL_COMMAND_SKELETON
      .replace("%a", file.id)  
      .replace("%b", file.name)
      .replace("%c", file.type),
    downloadLink: `${process.env.NEXT_PUBLIC_URL}/api/v1/download/${file.id}/${file.name}`
  }
}