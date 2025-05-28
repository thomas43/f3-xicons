// lib/xicon.ts
"use server";

import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getSubmissions() {
  return await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

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

  redirect("/submit?submitted=true");
}

export async function approveSubmission(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("Submission ID must be a string");
  }

  await prisma.submission.update({
    where: { id },
    data: { status: SubmissionStatus.approved },
  });
  revalidatePath("/admin/submissions");
}

export async function rejectSubmission(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("Submission ID must be a string");
  }

  await prisma.submission.update({
    where: { id },
    data: { status: SubmissionStatus.rejected },
  });
  revalidatePath("/admin/submissions");
}
