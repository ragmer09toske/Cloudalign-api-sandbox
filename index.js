require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ArgosRoutes = require("./Routes/GetAlarms/Argos");
const thingSpeakRoutes = require("./Routes/evirRoutes");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://netcloud-opal.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", ArgosRoutes);
app.use("/api", thingSpeakRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
