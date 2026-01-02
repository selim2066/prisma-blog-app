import express, { Application } from "express";
import { PostRouter } from "./module/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors'

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}))
app.use("/post", PostRouter);


app.get("/", (req, res) => {
  res.send("Hello, World!");
});
export default app;
