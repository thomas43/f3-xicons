// src/lib/xicon.ts
import { prisma } from "@/lib/prisma";
import { XiconType } from "@prisma/client";

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
