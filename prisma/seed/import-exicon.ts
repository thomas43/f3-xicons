// @ts-nocheck

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { PrismaClient, XiconType } = require("@prisma/client");
const { normalizeQuotes, parseReferences } = require("./utils");

const prisma = new PrismaClient();
const filePath = path.resolve(__dirname, "../../exicon.csv");

async function importExicon() {
  const records = [];

  const parser = fs
    .createReadStream(filePath, { encoding: "utf8" })
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push(record);
  }

  for (const row of records) {
    const name = normalizeQuotes(row["Title"]?.trim() ?? "");
    const description = normalizeQuotes(row["Text"]?.trim() ?? "");

    if (!name || !description) {
      console.warn("⚠️ Skipping invalid row:", row);
      continue;
    }

    // Parse tags from pipe-separated string
    const tags = row["Tags"]
      ? row["Tags"].split("|").map((tag) => normalizeQuotes(tag.trim())).filter(Boolean)
      : [];

    try {
      await prisma.xicon.upsert({
        where: {
          name_type: { name, type: XiconType.exicon },
        },
        update: {
          description,
          aliases: [],
          tags,
          videoUrl: null,
        },
        create: {
          name,
          description,
          type: XiconType.exicon,
          aliases: [],
          tags,
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

importExicon().catch((e) => {
  console.error("❌ Fatal error during import:", e);
  prisma.$disconnect();
  process.exit(1);
});

module.exports = {
  importExicon,
};
