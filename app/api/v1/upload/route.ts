import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const uuid = crypto.randomUUID();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const filename = (file as File).name.replaceAll(" ", "_");
  const uploadDir = path.join(process.cwd(), `files/${uuid}/`);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    const downloadLink = `${process.env.NEXT_PUBLIC_URL}/api/v1/download/${uuid}/${filename}`;
    return NextResponse.json({ message: downloadLink, status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
};