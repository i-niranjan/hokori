import { GoogleGenAI, Type } from "@google/genai";
import { env } from "./env.js";
import {
  buildRephrasePrompt,
  buildGeneratePrompt,
  buildResumeParsePrompt,
  TONES,
  type RephraseField,
  type Tone,
} from "../utils/system.prompt.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const MODEL = "gemini-3.1-flash-lite";

/** Strips wrapping quotes/whitespace the model sometimes adds around its answer. */
const clean = (text: string) =>
  text.trim().replace(/^["'`]+|["'`]+$/g, "").trim();

export async function rephraseText(
  text: string,
  field: RephraseField,
): Promise<string> {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: text,
    config: {
      systemInstruction: buildRephrasePrompt(field),
      temperature: 0.7,
    },
  });

  const out = clean(res.text ?? "");
  // Fall back to the original rather than handing back an empty field.
  return out || text;
}

/**
 * Rewrites the text once per tone so the user can pick a voice. Runs the calls
 * in parallel; any tone that fails or comes back empty falls back to the input.
 */
export async function rephraseVariants(
  text: string,
  field: RephraseField,
): Promise<{ tone: Tone; text: string }[]> {
  const variants = await Promise.all(
    TONES.map(async (tone) => {
      try {
        const res = await ai.models.generateContent({
          model: MODEL,
          contents: text,
          config: {
            systemInstruction: buildRephrasePrompt(field, tone),
            temperature: 0.8,
          },
        });
        return { tone, text: clean(res.text ?? "") || text };
      } catch {
        return { tone, text };
      }
    }),
  );
  return variants;
}

/** Generates a bio from a few user keywords/notes. */
export async function generateBio(prompt: string): Promise<string> {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: buildGeneratePrompt("bio"),
      temperature: 0.9,
    },
  });
  return clean(res.text ?? "");
}

const projectSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    desc: { type: Type.STRING },
    longDesc: { type: Type.STRING },
  },
  required: ["title", "desc", "longDesc"],
} as const;

/** Generates a full project (title + summary + long description) from a prompt. */
export async function generateProject(
  prompt: string,
): Promise<{ title: string; desc: string; longDesc: string }> {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: buildGeneratePrompt("project"),
      temperature: 0.9,
      responseMimeType: "application/json",
      responseSchema: projectSchema,
    },
  });

  const parsed = JSON.parse(res.text ?? "{}");
  return {
    title: clean(String(parsed.title ?? "")),
    desc: clean(String(parsed.desc ?? "")),
    longDesc: clean(String(parsed.longDesc ?? "")),
  };
}

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    role: { type: Type.STRING },
    bio: { type: Type.STRING },
    contactEmail: { type: Type.STRING },
    phone: { type: Type.STRING },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          desc: { type: Type.STRING },
          longDesc: { type: Type.STRING },
        },
        required: ["title", "desc"],
      },
    },
  },
  required: ["skills", "projects"],
} as const;

export interface ParsedResume {
  name?: string;
  role?: string;
  bio?: string;
  contactEmail?: string;
  phone?: string;
  skills: string[];
  projects: { title: string; desc: string; longDesc?: string }[];
}

/** Extracts structured portfolio data from a résumé PDF (sent inline as base64). */
export async function parseResume(
  buffer: Buffer,
  mimeType: string,
): Promise<ParsedResume> {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { text: buildResumeParsePrompt() },
      { inlineData: { data: buffer.toString("base64"), mimeType } },
    ],
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  const parsed = JSON.parse(res.text ?? "{}");
  const str = (v: unknown) => {
    const s = clean(String(v ?? ""));
    return s || undefined;
  };

  return {
    name: str(parsed.name),
    role: str(parsed.role),
    bio: str(parsed.bio),
    contactEmail: str(parsed.contactEmail),
    phone: str(parsed.phone),
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map((s: unknown) => clean(String(s ?? ""))).filter(Boolean)
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects
          .map((p: { title?: unknown; desc?: unknown; longDesc?: unknown }) => ({
            title: clean(String(p?.title ?? "")),
            desc: clean(String(p?.desc ?? "")),
            longDesc: clean(String(p?.longDesc ?? "")) || undefined,
          }))
          .filter((p: { title: string }) => p.title)
      : [],
  };
}
