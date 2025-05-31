// src/lib/xicon.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Xicon, XiconType } from "@prisma/client";


export async function getXiconEntries() {
  return prisma.xicon.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getExiconEntries() {
  return prisma.xicon.findMany({
    where: { type: XiconType.exicon },
    orderBy: { name: "asc" },
  });
}

export async function getLexiconEntries() {
    return prisma.xicon.findMany({
      where: { type: XiconType.lexicon },
      orderBy: { name: "asc" },
    });
}

export async function deleteXicon({ id }: { id: string }) {
  if (!id) throw new Error("Missing ID");

  await prisma.xicon.delete({ where: { id } });
}


export async function updateXicon(data: Xicon): Promise<Xicon> {
  return await prisma.xicon.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      aliases: data.aliases,
      tags: data.tags,
      videoUrl: data.videoUrl,
      submittedBy: data.submittedBy,
      region: data.region,
    },
  });
}
  