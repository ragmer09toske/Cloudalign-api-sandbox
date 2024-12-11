const express = require("express");
const cors = require("cors");
const Mongo_apiKey = process.env.MONGODB_KEY;
const http = require("http");
const { localEnv_3000_url, production_url } = require("./Constants");
const mongoose = require("mongoose");
const uri = `mongodb+srv://${Mongo_apiKey}.94i7emo.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pass the socket.io instance to the controller
app.use(
  cors({
    origin: [localEnv_3000_url, production_url],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routing
app.use("/", "new route");

const PORT = process.env.PORT || 8000;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Database Connection succeeded");
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
