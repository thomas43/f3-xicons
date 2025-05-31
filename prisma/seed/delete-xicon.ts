// @ts-nocheck

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteAllXicons() {
  const deleted = await prisma.xicon.deleteMany();

  console.log(`Deleted ${deleted.count} Xicon entries`);

  await prisma.$disconnect();
}

deleteAllXicons().catch((e) => {
  console.error("Error deleting Xicons:", e);
  process.exit(1);
});

module.exports = {
  deleteAllXicons,
};
