// lib/xicon.ts
"use server";

import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client"
import { revalidatePath } from "next/cache";

export async function submitEntry(formData: FormData) {
  const type = formData.get("type");
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const aliasesRaw = formData.get("aliases")?.toString();
  const tagsRaw = formData.get("tags")?.toString();
  const videoUrlRaw = formData.get("videoUrl")?.toString();

  if (!type || !name || !description) {
    throw new Error("Missing required fields.");
  }

  const aliases = aliasesRaw
    ? aliasesRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const tags = tagsRaw
    ? tagsRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const videoUrl = videoUrlRaw && videoUrlRaw.length > 0 ? videoUrlRaw : null;

  await prisma.submission.create({
    data: {
      type,
      name,
      description,
      aliases,
      tags,
      videoUrl,
      status: SubmissionStatus.pending,
    },
  });

  revalidatePath("/submit", "page");
}
