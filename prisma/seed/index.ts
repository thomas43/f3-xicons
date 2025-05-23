// @ts-nocheck
const { importExicon } = require("./import-exicon");
const { importLexicon } = require("./import-lexicon");

async function main() {
    await importExicon();
    await importLexicon();
    console.log("✅ Seeding complete.");
  }
  
  main().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });