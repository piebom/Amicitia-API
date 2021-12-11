import { PrismaClient } from ".prisma/client";
import { activities } from "../data/activities";

const prisma = new PrismaClient();
async function main(){
  await prisma.activity.createMany({
    data: activities
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });