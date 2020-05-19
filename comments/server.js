const express = require("express");
const fs = require("fs-extra");
const axios = require("axios");
const uuid = require("uuid").v4;
const cors = require("cors");
const comments = require("./comments.json");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 9999;

app
  .route("/comments/:postId")
  .get((req, res) => {
    const { postId } = req.params;
    res.json({
      statusCode: 200,
      comments: comments.filter(c => c.postId === postId),
    });
  })
  .post(async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    const comment = { postId, content, _id: uuid(), status: "pending" };
    comments.push(comment);
    await fs.writeFile("./comments.json", JSON.stringify(comments), {
      encoding: "utf-8",
    });
    const commentCreatedEvent = { type: "CommentCreated", payload: comment };
    await axios.post("http://localhost:9996/events", commentCreatedEvent);
    res.status(201).json({ statusCode: 201, comment });
  });

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;
  console.log(`Event of type ${type} is received`);
  if (type === "CommentModerated") {
    const { _id, content, status, postId } = payload;
    const commentIndex = comments.findIndex(comment => comment._id === _id);
    comments[commentIndex] = { _id, content, status, postId };
    const commentUpdatedEvent = {
      type: "CommentUpdated",
      payload: { content, _id, status, postId },
    };
    await axios.post("http://localhost:9996/events", commentUpdatedEvent);
  }
  res.status(202).send(`Event of type ${type} received`);
});

app.listen(PORT, () =>
  console.log(`Comments Service connected on PORT: ${PORT}`)
);
