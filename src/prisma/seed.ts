import { PrismaClient } from ".prisma/client";
import { activities } from "../data/activities";

const prisma = new PrismaClient();

async function main(){
  await prisma.user.create({
    data:{
      email: "test@gmail.com",
      password: "test123"
    }
  });

  await prisma.activity.createMany({
    data: activities,
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