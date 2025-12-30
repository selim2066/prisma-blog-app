import app from "../../../app";
import { prisma } from "../prisma";

const PORT = process.env.PORT || 3000;
async function main() {
  try {
    await prisma.$connect();
    console.log("server successfully connected");

    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  } catch (error: any) {
    console.log(error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
