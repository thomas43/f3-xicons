// @ts-nocheck

import { normalizeQuotes } from "./utils.js";
const prisma = new PrismaClient();

async function fixDescriptions() {
  const entries = await prisma.xicon.findMany();

  for (const entry of entries) {
    const fixedDescription = normalizeQuotes(entry.description);
    if (fixedDescription !== entry.description) {
      await prisma.xicon.update({
        where: { id: entry.id },
        data: { description: fixedDescription },
      });
      console.log(`✔ Fixed: ${entry.name}`);
    }
  }

  await prisma.$disconnect();
}

fixDescriptions().catch((err) => {
  console.error("❌ Error updating entries:", err);
  process.exit(1);
});
