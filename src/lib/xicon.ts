// src/lib/xicon.ts
import { prisma } from "@/lib/prisma";
import { XiconType } from "@prisma/client";

export async function getExiconEntries() {
  return prisma.xicon.findMany({
    where: { type: XiconType.exicon },
    orderBy: { name: "asc" },
  });
}
