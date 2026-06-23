import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "src/data/content.json");
  const raw = await readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}
