import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ uuid: string, filename: string }> }) => {
  const uuid = (await params).uuid
  const filename = (await params).filename

  const filePath = path.join(process.cwd(), `files/${uuid}/${filename}`);

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "File not found", status: 404 });
  }
};
