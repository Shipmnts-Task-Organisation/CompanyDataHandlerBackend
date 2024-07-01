const express = require("express");
const connectDB = require("./db");
const router = require("./src/routes/router");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();

connectDB();
app.use(cors());

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
