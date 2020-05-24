const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs-extra");

const queries = require("./queries.json");

const app = express();
const PORT = 9997;

const processEvent = async ({ type, payload }) => {
  const event = { type: "EmptyQueryCreated", payload: null };
  console.log(`Event of type ${type} received`);
  switch (type) {
    case "PostCreated": {
      if (queries.find(q => q._id === payload._id)) return event;
      const query = { ...payload, comments: [] };
      queries.push(query);
      await fs.writeFile("./queries.json", JSON.stringify(queries), {
        encoding: "utf-8",
      });
      event.type = "PostCreateQueryCreated";
      return event;
    }
    case "CommentCreated": {
      const { content, _id, postId, status } = payload;
      const post = queries.find(q => q._id === postId);
      if (!post) return res.sendStatus(404);
      if (post.comments.find(c => c._id === _id)) return event;
      post.comments.push({ content, _id, status });
      await fs.writeFile("./queries.json", JSON.stringify(queries), {
        encoding: "utf-8",
      });
      event.type = "CommentCreateQueryCreated";
      return event;
    }
    case "CommentUpdated": {
      const { content, _id, postId, status } = payload;
      const post = queries.find(q => q._id === postId);
      if (!post) return res.sendStatus(404);
      const commentIndex = post.comments.findIndex(c => c._id === _id);
      if (post.comments[commentIndex].status === status) return event;
      post.comments[commentIndex] = { _id, content, status };
      await fs.writeFile("./queries.json", JSON.stringify(queries), {
        encoding: "utf-8",
      });
      event.type = "CommentUpdateQueryCreated";
      return event;
    }
    default:
      return event;
  }
};

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/posts", (_, res) => res.json({ posts: queries }));

app.post("/events", async (req, res) => {
  const resultantEvent = await processEvent(req.body);
  resultantEvent.type !== "EmptyQueryCreated" &&
    (await axios.post("http://event-bus-srv:9996/events", resultantEvent));
  return res.sendStatus(202);
});

app.listen(PORT, async () => {
  console.log(`Query Service connected on PORT: ${PORT}`);
  const {
    data: { events },
  } = await axios.get("http://event-bus-srv:9996/events");
  events.length && events.forEach(e => processEvent(e));
});
