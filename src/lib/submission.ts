// lib/xicon.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Submission, SubmissionStatus } from "@prisma/client"
import { redirect } from "next/navigation";

export async function getSubmissions() {
  // If prisma or the submission delegate is undefined for some reason, return an empty array.
  if (!prisma || !prisma.submission) {
    console.error("Prisma or prisma.submission is undefined");
    return [];
  }

  try {
    return await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return [];
  }
}


export async function submitEntry(formData: FormData) {
  const type = formData.get("type");
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const aliasesRaw = formData.get("aliases")?.toString();
  const tagsRaw = formData.get("tags")?.toString();
  const videoUrlRaw = formData.get("videoUrl")?.toString();
  const submittedBy = formData.get("submittedBy")?.toString();
  const region = formData.get("region")?.toString();
  const contactEmail = formData.get("contactEmail")?.toString();


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
      submittedBy,
      region,
      contactEmail,
    },
  });

  //redirect("/submit?submitted=true");
}

export async function approveSubmission(submissionId: string) {
  if (!submissionId) throw new Error("Missing submission ID");


  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: SubmissionStatus.approved },
  });

  return prisma.submission.findUnique({ where: { id: submissionId } });

}

export async function pendingSubmission(submissionId: string) {
  if (!submissionId) throw new Error("Missing submission ID");

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: SubmissionStatus.pending,
      // reviewedAt: new Date(),
      // reviewedBy: ...
    },
  });

  return prisma.submission.findUnique({ where: { id: submissionId } });
}

export async function rejectSubmission(submissionId: string) {
  if (!submissionId) throw new Error("Missing submission ID");

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: SubmissionStatus.rejected,
      // reviewedAt: new Date(),
      // reviewedBy: ...
    },
  });

  return prisma.submission.findUnique({ where: { id: submissionId } });
}

export async function updateSubmission(data: Submission): Promise<Submission> {
  return await prisma.submission.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      aliases: data.aliases,
      tags: data.tags,
      videoUrl: data.videoUrl,
      submittedBy: data.submittedBy,
      region: data.region,
      contactEmail: data.contactEmail,
    },
  });
}

export async function promoteSubmissionToXicon(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) throw new Error("Submission not found");

  const {
    name,
    description,
    aliases,
    tags,
    videoUrl,
    type,
    submittedBy,
    region,
  } = submission;

  const existing = await prisma.xicon.findFirst({
    where: {
      OR: [
        { name: submission.name },
        // Leaving these commented out for now, aliases don't need to hold up promotion
        //{ aliases: { has: submission.name } },
        //{ aliases: { hasSome: submission.aliases } },
      ],
    },
  });
  
  if (existing) {
    throw new Error("Duplicate found in Xicon entries.");
  }
  
  await prisma.$transaction([
    prisma.submission.update({
      where: { id: submissionId },
      data: { status: "approved" },
    }),
    prisma.xicon.create({
      data: {
        name,
        description,
        aliases,
        tags,
        videoUrl,
        type,
        submittedBy,
        region,
      },
    }),
  ]);
}

export async function deleteSubmission(submissionId: string) {
  if (!submissionId) {
    throw new Error("Missing submission ID");
  }
  // Delete the submission row
  await prisma.submission.delete({ where: { id: submissionId } });
}