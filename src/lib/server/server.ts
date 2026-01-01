import dotenv from "dotenv";
import app from "../../app";
import { prisma } from "../prisma";
dotenv.config();
const PORT = process.env.PORT;

//console.log(typeof(PORT))
async function main() {
  try {
    await prisma.$connect();
    console.log("server successfully connected", PORT);

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
