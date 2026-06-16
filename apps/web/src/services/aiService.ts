import api from "@/models/auth/refresh";
import type {
  RephraseVariant,
  GeneratedProject,
  ResumeParseResult,
} from "@hokori/types";

/** Must stay in sync with REPHRASE_FIELDS on the server. */
export type RephraseField = "bio" | "projectSummary" | "projectLongDesc";

export async function rephraseText(
  text: string,
  field: RephraseField,
): Promise<string> {
  const result = await api.post("/ai/rephrase", { text, field });
  return result.data.data.text;
}

export async function rephraseVariants(
  text: string,
  field: RephraseField,
): Promise<RephraseVariant[]> {
  const result = await api.post("/ai/rephrase-variants", { text, field });
  return result.data.data.variants;
}

export async function generateBio(prompt: string): Promise<string> {
  const result = await api.post("/ai/generate", { field: "bio", prompt });
  return result.data.data.text;
}

export async function generateProject(
  prompt: string,
): Promise<GeneratedProject> {
  const result = await api.post("/ai/generate", { field: "project", prompt });
  return result.data.data.project;
}

export async function importResume(file: File): Promise<ResumeParseResult> {
  const form = new FormData();
  form.append("file", file);
  const result = await api.post("/ai/import-resume", form);
  return result.data.data;
}
