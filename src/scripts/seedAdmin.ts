import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/authMiddleware";

async function seedAdmin() {
  // admin data
  const adminData = {
    name: "adminAmi",
    email: "selim@gmail.com",
    password: "admin123",
    role: UserRole.ADMIN,
  };

  // check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existingAdmin) {
    throw new Error("Admin user already exists. Skipping seeding.");
  }

  if (!existingAdmin) {
    // create admin user
    const signUpAdmin = await fetch(
      "http://localhost:3001/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    // ! Explanation:
    /* This code is used to create (sign up) an admin user by calling your backend API.

    Specifically:

    It sends admin data (email, password, role, etc.)

    To your backend endpoint:
    POST /api/auth/sign-up/email

    The backend then:

    # Validates data

    # Hashes password

    # Saves admin in the database */

    if (!signUpAdmin.ok) {
      throw new Error("Failed to create admin user.");
    }

    console.log("Admin user created successfully.");
  }
}
