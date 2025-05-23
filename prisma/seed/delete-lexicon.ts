// @ts-nocheck

const { PrismaClient, XiconType } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteLexicon() {
  const deleted = await prisma.xicon.deleteMany({
    where: {
      type: XiconType.lexicon,
    },
  });

  console.log(`🗑️ Deleted ${deleted.count} Lexicon entries`);

  await prisma.$disconnect();
}

deleteLexicon().catch((e) => {
  console.error("❌ Error deleting Lexicon:", e);
  process.exit(1);
});

module.exports = {
  deleteLexicon,
};
