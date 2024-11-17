import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

// >curl -X "POST" "http://localhost:3000/api/v1/upload" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "file=@filename.ext;type=application/type-of-file"

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No files received." }, { status: 400 });

  // get x-access-token
  const token = req.headers.get("x-access-token");
  if (!token) return NextResponse.json({ error: "No token provided." }, { status: 401 });

  const dbFile = await prisma.file.findUnique({
    where: { id: token },
  });
  if (!dbFile) return NextResponse.json({ error: "Invalid token provided." }, { status: 401 });

  if (dbFile.uploaded) return NextResponse.json({ error: "File already uploaded." }, { status: 400 });

  if (dbFile.type !== file.type) return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
  if (dbFile.name !== file.name) return NextResponse.json({ error: "Invalid file name." }, { status: 400 });

  // check if file is smaller than 500mb
  if (file.size > 524288000) return NextResponse.json({ error: "File is too large." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const uploadDir = path.join(process.cwd(), `files/${dbFile.id}/`);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    await prisma.file.update({
      where: { id: token },
      data: { uploaded: true, uploadTime: new Date(), size: file.size },
    });
    const downloadLink = `${process.env.NEXT_PUBLIC_URL}/api/v1/download/${dbFile.id}/${filename}`;
    return NextResponse.json({ message: "Uploaded successfully", link: downloadLink, status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
};