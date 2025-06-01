// @ts-nocheck

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { PrismaClient, XiconType } = require("@prisma/client");

const prisma = new PrismaClient();
const filePath = path.resolve(__dirname, "../../seed-csv/02-xicons-all-f3vexicon-vids-xicons-all-save.csv"); 

function parseCSVField(field) {
  return field?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
}

async function importXicons() {
  const records = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push(record);
  }

  for (const row of records) {
    const name = row["Name"]?.trim();
    const description = row["Description"]?.trim();

    if (!name || !description) {
      console.warn("Skipping row due to missing name or description");
      continue;
    }

    const aliases = parseCSVField(row["Aliases"]);
    const tags = parseCSVField(row["Tags"]);
    const typeRaw = row["Type"]?.trim().toLowerCase();
    const type =
      typeRaw === "lexicon"
        ? XiconType.lexicon
        : typeRaw === "exicon"
        ? XiconType.exicon
        : null;

    if (!type) {
      console.warn(`Skipping row with unknown type: ${typeRaw}`);
      continue;
    }

    const videoUrl = row["Video URL"]?.trim() || null;
    const submittedBy = row["Submitted By"]?.trim() || "";
    const region = row["Region"]?.trim() || "";

    try {
      await prisma.xicon.upsert({
        where: {
          name_type: {
            name,
            type,
          },
        },
        update: {
          description,
          aliases,
          tags,
          videoUrl,
          submittedBy,
          region,
        },
        create: {
          name,
          type,
          description,
          aliases,
          tags,
          videoUrl,
          submittedBy,
          region,
        },
      });

      console.log(`Upserted: ${name} [${type}]`);
    } catch (err) {
      console.error(`Failed to upsert ${name}:`, err);
    }
  }

  await prisma.$disconnect();
  console.log("Import complete");
}

importXicons().catch((e) => {
  console.error("Fatal error during import:", e);
  process.exit(1);
});
