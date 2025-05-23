// @ts-nocheck

const { PrismaClient, XiconType } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteExicon() {
  const deleted = await prisma.xicon.deleteMany({
    where: {
      type: XiconType.exicon,
    },
  });

  console.log(`🗑️ Deleted ${deleted.count} Exicon entries`);

  await prisma.$disconnect();
}

deleteExicon().catch((e) => {
  console.error("❌ Error deleting Exicon:", e);
  process.exit(1);
});

module.exports = {
  deleteExicon,
};
