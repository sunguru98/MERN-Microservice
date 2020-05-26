const express = require("express");
const fs = require("fs-extra");
const axios = require("axios");
const uuid = require("uuid").v4;
const cors = require("cors");
const morgan = require("morgan");
const posts = require("./posts.json");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const PORT = 9998;

app
  .route("/posts/create")
  .get((_, res) => {
    res.json({ statusCode: 200, posts });
  })
  .post(async (req, res) => {
    const { title } = req.body;
    const post = { title, _id: uuid() };
    posts.push(post);
    await fs.writeFile("./posts.json", JSON.stringify(posts), {
      encoding: "utf-8",
    });
    const postCreatedEvent = { type: "PostCreated", payload: post };
    await axios.post("http://event-bus-srv:9996/events", postCreatedEvent);
    res.status(201).json({ statusCode: 201, post });
  });

app.post("/events", (req, res) => {
  const event = req.body;
  console.log(`Event of type ${event.type} is received`);
  res.status(202).send(`Event of type ${event.type} received`);
});

app.listen(PORT, () =>
  console.log(`Version 2: Post Service connected on PORT: ${PORT}`)
);
