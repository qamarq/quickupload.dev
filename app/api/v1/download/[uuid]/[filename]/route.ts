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
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": dbFile.size!.toString(),
      },
    });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "File not found", status: 404 });
  }
};
