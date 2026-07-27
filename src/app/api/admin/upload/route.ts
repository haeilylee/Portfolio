import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { join, dirname, extname, basename } from "path";

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = (form.get("slug") as string) || "misc";

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 한글/유니코드 파일명은 그대로 유지해서 파일 내용을 알아볼 수 있게 하고,
  // 경로에 위험한 문자만 제거한다. 이름이 겹치면 덮어쓰지 않고 번호를 붙인다.
  const rawName = file.name.normalize("NFC");
  const ext = extname(rawName);
  const base = basename(rawName, ext)
    .replace(/[\\/:*?"<>|\x00-\x1F]/g, "")
    .replace(/\s+/g, "-")
    .trim() || "file";

  const dir = join(process.cwd(), "public", "images", slug);
  await mkdir(dir, { recursive: true });

  let name = `${base}${ext}`;
  let i = 1;
  while (await exists(join(dir, name))) {
    name = `${base}-${i}${ext}`;
    i++;
  }

  await writeFile(join(dir, name), buffer);

  return NextResponse.json({ src: `/images/${slug}/${name}` });
}
