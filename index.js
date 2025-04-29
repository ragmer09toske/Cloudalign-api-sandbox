require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ArgosRoutes = require("./Routes/GetAlarms/Argos");
const mongoose = require("mongoose");
const Mongo_apiKey = process.env.MONGODB_KEY;
const uri = `mongodb+srv://${Mongo_apiKey}.c0huo.mongodb.net/?retryWrites=true&w=majority&appName=MangmosothoAuth`;
const genericRoutes = require("./Routes/evirRoutes");
// const epharmOTPRoutes = require("./Routes/ePharm/otpRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", ArgosRoutes);
app.use("/api", genericRoutes);
// app.use("/api/epharm/opt", epharmOTPRoutes);

// Start the server
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
