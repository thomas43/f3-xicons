// @ts-nocheck

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { PrismaClient, XiconType } = require("@prisma/client");

const prisma = new PrismaClient();

const filePath = path.resolve(__dirname, "../../exicon.csv");

async function importExicon() {
  const records: any[] = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push(record);
  }

  // exicon.csv has Title,Tags,Text
  for (const row of records) {
    const name = row["Title"]?.trim();
    const description = row["Text"]?.trim();

    if (!name || !description) {
      console.warn(`Skipping incomplete row:`, row);
      continue;
    }

    await prisma.xicon.create({
      data: {
        type: XiconType.exicon,
        name,
        description,
        aliases: [],
        tags: parseTags(row["Tags"]),
        references: parseReferences(description),
        videoUrl: null,
      },
    });

    console.log(`✅ Imported: ${name}`);
  }

  await prisma.$disconnect();
}

function parseTags(tags: string | undefined): string[] {
  if (!tags || tags.trim() === "") return [];
  return tags
    .split("|")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function parseReferences(text: string): string[] {
  const refRegex = /@([\w\s\-]+)/g;
  const matches = [];
  let match;
  while ((match = refRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

importExicon().catch((e: any) => {
    console.error("❌ Error importing Exicon:", e);
  process.exit(1);
});
