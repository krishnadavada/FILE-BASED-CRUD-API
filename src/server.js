const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dataRoute = require("./routes/dataRoutes");
const { createResponse } = require("./helpers/response");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//middleware for error
app.use((err, req, res, next) => {
  return res.status(err.status).json({message:err.message})
});

// middleware for data routes
app.use("/api/data", dataRoute);

//middleware for serve static files
app.use("/public", express.static("src/public"));

//health check
app.get("/health", (req, res) => {
  return createResponse(res, 'OK', 'server_up');
});

app.all("/*", (req, res) => {
  return createResponse(res, 'NotFound', 'not_found', 'Route');
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is listening on http://localhost:${port}`);
  }
});
