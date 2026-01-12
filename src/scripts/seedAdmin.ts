import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/authMiddleware";

async function seedAdmin() {

  // admin data
  const adminData = {
    name: 'adminAmi',
    email: 'selim@gmail.com',
    password:'admin123',
    role: UserRole.ADMIN
  };

  // check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existingAdmin) {
    throw new Error('Admin user already exists. Skipping seeding.');
  
  }
}
