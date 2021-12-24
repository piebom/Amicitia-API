import { PrismaClient } from ".prisma/client";
const prisma = new PrismaClient();
import { activities } from "../data/activities";
import { user } from "../data/user";
import { favorite } from "../data/favorite";

async function main(){
  await prisma.activity.createMany({
    data: activities
  });
  await prisma.user.createMany({
    data: user
  })
  await prisma.favorite.createMany({
    data: favorite
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });