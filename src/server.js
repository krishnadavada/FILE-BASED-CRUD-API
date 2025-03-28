const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dataRoute = require("./routes/dataRoutes");
const { createResponse } = require("./helpers/response");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  return createResponse({
    res,
    nStatusCode: err.statusCode,
    bIsError: err.message,
  });
});

app.use("/api/data", dataRoute);
app.use("/public", express.static("src/public"));

app.get("/health", (req, res) =>
  res.status(200).send({ status: "up", timeStamp: new Date() })
);

app.all("/*", (req, res) => {
  return createResponse({
    res,
    nStatusCode: 404,
    bIsError: "Route not found !",
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`server is listening on http://localhost:${port}`);
  }
});
