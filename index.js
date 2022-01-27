const express = require("express");
const axios = require("axios").default;
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(axios());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11wfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("travelhooDb");
    const dailyNewsCollection = database.collection("travelnews");
    // console.log('Database Get Connection')

    // GET API
    app.get("/dailyNews", async (req, res) => {
      const getDailyNews = dailyNewsCollection.find({});
      const dailyNews = await getDailyNews.toArray();
      res.send(dailyNews);
    });

    // // GET Single Data API

    app.get("/dailyNews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const news = await dailyNewsCollection.findOne(query);

      res.json(news);
    });

    // POST API
    app.post("/shareExperience", async (req, res) => {
      const newDailyNews = req.body;
      const result = await dailyNewsCollection.insertOne(newDailyNews);
      console.log("added package", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('This is my CRUD Server is runnig! Woow');
// });
app.get("/hello", (req, res) => {
  res.send("I am Ready to use");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
