import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/db";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ uuid: string, filename: string }> }) => {
  const uuid = (await params).uuid
  const filename = (await params).filename

  const dbFile = await prisma.file.findUnique({
    where: { id: uuid },
  });
  if (!dbFile) return NextResponse.json({ message: "File not found", status: 404 });
  if (dbFile.name !== filename) return NextResponse.json({ message: "Invalid file name", status: 400 });
  if (!dbFile.uploaded) return NextResponse.json({ message: "File not uploaded", status: 400 });

  const filePath = path.join(process.cwd(), `files/${uuid}/${filename}`);

  try {
    await prisma.file.update({
      where: { id: uuid },
      data: { downloads: { increment: 1 } },
    });
    const fileStats = await fs.stat(filePath);
    const fileHandle = await fs.open(filePath)
    const stream = fileHandle.readableWebStream({ type: "bytes" })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileStats.size.toString(),
      },
    })
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "File not found", status: 404 });
  }
};
