const dataController = require("../controllers/dataController");
const dataMiddleware = require("../middlewares/validate");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  dataController.getAllData(req, res);
});

router.get("/:iId", dataMiddleware.validateId, (req, res) => {
  dataController.getDataById(req, res);
});

router.post("/", dataMiddleware.validateData, (req, res) => {
    dataController.addData(req, res);
  }
);

router.put("/:iId", dataMiddleware.validateId, (req, res) => {
  dataController.updateData(req, res);
});

router.delete("/:iId", dataMiddleware.validateId, (req, res) => {
  dataController.deleteData(req, res);
});

router.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
