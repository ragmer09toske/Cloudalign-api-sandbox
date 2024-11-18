const express = require("express");
const app = express();
const cors = require("cors");
const ArgosRoutes = require("./Routes/GetAlarms/Argos");
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// routing
app.use("/", ArgosRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
