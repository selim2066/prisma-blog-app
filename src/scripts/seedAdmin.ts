import { UserRole } from "../middleware/authMiddleware";

async function seedAdmin() {

  // admin data
  const adminData = {
    name: 'adminAmi',
    email: 'selim@gmail.com',
    password:'admin123',
    role: UserRole.ADMIN
  };
}