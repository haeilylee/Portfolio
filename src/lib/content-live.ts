import { readFile } from "fs/promises";
import { join } from "path";
import type { Hero, Project } from "@/lib/projects";

/**
 * content.json을 요청 시점에 디스크에서 읽는다.
 * 시안(Preview) 페이지에서 Admin 저장 결과가 새로고침만으로 반영되도록 번들된 import 대신 사용.
 */
export async function readContentLive(): Promise<{ hero: Hero; projects: Project[] }> {
  const filePath = join(process.cwd(), "src/data/content.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}
