import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  // Logic to create a new post
  res.status(201).send("Post created");
});
export const PostRouter = router;