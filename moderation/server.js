const express = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = 9995; // MODERATION
const app = express();
app.use(express.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;
  console.log(`Event of type ${type} is received`);
  const checkableWords = ["orange"];
  if (type === "CommentCreated") {
    const { _id, content, postId } = payload;
    const isFlaggedComment = checkableWords.some(word =>
      content.toLowerCase().includes(word)
    );
    const commentModeratedEvent = {
      type: "CommentModerated",
      payload: {
        _id,
        content,
        postId,
        status: isFlaggedComment ? "rejected" : "resolved",
      },
    };
    setTimeout(async () => {
      await axios.post(
        "http://event-bus-srv:9996/events",
        commentModeratedEvent
      );
      return res
        .status(203)
        .send({ statusCode: 203, message: `Event of type ${type} received` });
    }, 2000);
    return;
  }
  return res
    .status(203)
    .send({ statusCode: 203, message: `Event of type ${type} received` });
});

app.listen(PORT, () =>
  console.log(`Moderation Service connected on PORT: ${PORT}`)
);
