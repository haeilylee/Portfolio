import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = (form.get("slug") as string) || "misc";

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const rel = `/images/${slug}/${name}`;
  const abs = join(process.cwd(), "public", rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, buffer);

  return NextResponse.json({ src: rel });
}
