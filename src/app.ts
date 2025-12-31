import express, { Application } from "express";
import { PostRouter } from "./module/post/post.router";

const app: Application = express();

app.use(express.json());
app.use("/post", PostRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
export default app;
