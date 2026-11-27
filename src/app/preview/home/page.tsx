import { projects } from "@/lib/projects";
import SketchHome from "./home";

export default function PreviewSketchHome() {
  return <SketchHome projects={projects} />;
}
