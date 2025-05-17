// @ts-nocheck

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { PrismaClient, XiconType } = require("@prisma/client");
import { normalizeQuotes, parseReferences } from "./utils";

const prisma = new PrismaClient();
const filePath = path.resolve(__dirname, "../../lexicon.csv");

  
// Lexicon has Title, Text
async function importLexicon() {
  const records = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push(record);
  }

  for (const row of records) {
    const name = row["Title"]?.trim();
    const description = normalizeQuotes(row["Text"]?.trim() ?? "");

    if (!name || !description) {
      console.warn("⚠️ Skipping invalid row:", row);
      continue;
    }

    await prisma.xicon.create({
      data: {
        type: XiconType.lexicon,
        name,
        description,
        aliases: [],
        tags: [],
        references: parseReferences(description),
        videoUrl: null,
      },
    });

    console.log(`✅ Imported: ${name}`);
  }

  await prisma.$disconnect();
}

importLexicon().catch((e) => {
  console.error("❌ Error importing Lexicon:", e);
  process.exit(1);
});
