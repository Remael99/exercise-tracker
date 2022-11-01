const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const Exercise = require("./models/exercise.model");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;

  User.create(
    {
      username,
    },
    (err, doc) => {
      if (err) {
        console.log(err);
        return err;
      }

      return res.json({
        username: doc.username,
        _id: doc._id,
      });
    }
  );
});

app.get("/api/users", (req, res) => {
  User.find()
    .select({ username: true, _id: true })
    .exec((err, doc) => {
      if (err) {
        console.log(err);
        return res.json({ error: "failed" });
      }
      return res.json(doc);
    });
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const user = await User.findById({ _id }).select({
      username: true,
      _id: true,
    });

    if (!user) {
      return res.json({ error: "no such user" });
    }

    const valid_date = !date
      ? new Date().toDateString()
      : new Date(date).toDateString();

    const exercise = await Exercise.create({
      description,
      duration,
      date: valid_date,
      user_id: _id,
    });

    return res.json({
      _id: user._id,
      username: user.username,
      date: new Date(exercise.date).toDateString(),
      duration: exercise.duration,
      description: exercise.description,
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id });

  if (Object.keys(req.query).length > 0) {
    const { from, to, limit } = req.query;
    console.log("free", from, to, limit);

    if (
      new Date(from).toDateString() === "Invalid Date" ||
      new Date(from).toDateString() === "Invalid Date"
    ) {
      const exercise = await Exercise.find({
        user_id: _id,
      })
      .limit(limit);

      const log = exercise.map((exercise) => {
        return {
          date: new Date(exercise.date).toDateString(),
          duration: exercise.duration,
          description: exercise.description,
        };
      });

      return res.json({
        _id: user._id,
        username: user.username,
        count: exercise.length,
        log,
      });
    }

    const exercise = await Exercise.find({
      user_id: _id,
    })
      .where("date")
      .gte(new Date(from).toDateString())
      .lte(new Date(to).toDateString())
      .limit(limit);

    const log = exercise.map((exercise) => {
      return {
        date: new Date(exercise.date).toDateString(),
        duration: exercise.duration,
        description: exercise.description,
      };
    });

    return res.json({
      _id: user._id,
      username: user.username,
      count: exercise.length,
      log,
    });
  }

  const exercise = await Exercise.find({
    user_id: _id,
  });

  const log = exercise.map((exercise) => {
    return {
      date: new Date(exercise.date).toDateString(),
      duration: exercise.duration,
      description: exercise.description,
    };
  });

  return res.json({
    _id: user._id,
    username: user.username,
    count: exercise.length,
    log,
  });
});

///api/users/:_id/logs
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
