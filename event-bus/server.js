const express = require("express");
const axios = require("axios");
const fs = require("fs-extra");

const events = require("./events.json");
const app = express();
const PORT = 9996; // EVENT BUS

app.use(express.json());

app
  .route("/events")
  .post(async (req, res) => {
    const event = req.body;
    events.push(event);
    await fs.writeFile("./events.json", JSON.stringify(events), {
      encoding: "utf-8",
    });
    console.log(`Event of type ${event.type} is received onto the event bus`);
    axios.post("http://posts-srv-clusterip:9998/events", event); // POSTS SERVICE
    axios.post("http://localhost:9999/events", event); // COMMENTS SERVICE
    axios.post("http://localhost:9995/events", event); // MODERATION SERVICE
    axios.post("http://localhost:9997/events", event); // QUERY SERVICE
    res
      .status(202)
      .send({ statusCode: 202, message: "Events fired successfully!" });
  })
  .get((_, res) => res.status(200).json({ statusCode: 200, events }));

app.listen(PORT, () => console.log(`Event Bus connected on PORT: ${PORT}`));
