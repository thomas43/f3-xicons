// @ts-nocheck

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { PrismaClient, XiconType } = require("@prisma/client");
const { normalizeQuotes, parseReferences } = require("./utils");

const prisma = new PrismaClient();
const filePath = path.resolve(__dirname, "../../lexicon.csv");

async function importLexicon() {
  const records = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push(record);
  }

  for (const row of records) {
    const name = normalizeQuotes(row["Title"]?.trim());
    const description = normalizeQuotes(row["Text"]?.trim() ?? "");

    if (!name || !description) {
      console.warn("⚠️ Skipping invalid row:", row);
      continue;
    }

    try {
      await prisma.xicon.upsert({
        where: {
          name_type: { name, type: XiconType.lexicon },
        },
        update: {
          description,
          aliases: [], // May update later when data is added to CSV
          tags: [],
          videoUrl: null,
        },
        create: {
          name,
          description,
          type: XiconType.lexicon,
          aliases: [],
          tags: [],
          videoUrl: null,
        },
      });

      console.log(`✅ Imported: ${name}`);
    } catch (error) {
      console.error(`❌ Error importing "${name}":`, error.message);
    }
  }

  await prisma.$disconnect();
}

importLexicon().catch((e) => {
  console.error("❌ Fatal error during import:", e);
  prisma.$disconnect();
  process.exit(1);
});

module.exports = {
  importLexicon,
};
