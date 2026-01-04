import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";
import { PostController } from "./post.controller";

// type decalaration for user and user role
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        phone?: string;
        status?: string;
        emailVerified: boolean;
      };
    }
  }
}

const router = express.Router();
const authMiddleware = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //headers
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    // console.log(session?.user.role)
    //console.log(session?.user);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!session.user.emailVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email!,
      role: session.user.role as string,
      //phone:session.user.phone,
      //status:session.user.status,
      emailVerified: session.user.emailVerified,
    };

    if (role.length && !role.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

router.post("/", authMiddleware(UserRole.ADMIN), PostController.createPost);
export const PostRouter = router;
