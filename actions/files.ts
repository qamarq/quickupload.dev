"use server"

import { prisma } from "@/lib/db"
import { verifyCaptcha } from "@/lib/recaptcha";
import { actionClient } from "@/lib/safe-action";
import { requestSchema } from "@/schemas";
import { z } from "zod";

export const generateNewFile = actionClient
  .schema(requestSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof requestSchema> }) => {
    const captchaVerified = await verifyCaptcha(parsedInput.captcha)
    if (captchaVerified.error) {
        console.log(captchaVerified.error)
        return { failure: true, message: "Captcha error" }
    }

    const file = await prisma.file.create({
      data: {
        name: parsedInput.name + parsedInput.extension,
        type: parsedInput.type
      }
    })

    return {
      success: true,
      prepared: {
        id: file.id,
        name: file.name,
        type: file.type
      },
      // curl: CURL_COMMAND_SKELETON
      //   .replace("%a", file.id)  
      //   .replace("%b", file.name)
      //   .replace("%c", file.type),
      downloadLink: `${process.env.NEXT_PUBLIC_URL}/api/v1/download/${file.id}/${file.name}`
    }
})