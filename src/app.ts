import express, { Application } from "express";
import { PostRouter } from "./module/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors'
import { CommentRouter } from "./module/comment/comment.router";
import errorHandlerHelper from "./middleware/errorHandlerHelper";


const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}))

// ! post router
app.use("/post", PostRouter);

// ! comment router

app.use("/comment",CommentRouter)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(errorHandlerHelper)
export default app;
