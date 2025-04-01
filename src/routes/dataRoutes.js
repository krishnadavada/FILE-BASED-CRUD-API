const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");
const dataMiddleware = require("../middlewares/validate");
const { createResponse } = require("../helpers/response");

//route for get all data
router.get("/", (req, res) => {
  dataController.getAllData(req, res);
});

//route for get data by id
router.get(
  "/:iId",
  [
    dataMiddleware.aIdValidator, 
    dataMiddleware.validateReq
  ],
  (req, res) => {
    dataController.getDataById(req, res);
  }
);

//route for add new data
router.post(
  "/",
  [
    dataMiddleware.aDataValidator, 
    dataMiddleware.validateReq
  ],
  (req, res) => {
    dataController.addData(req, res);
  }
);

//route for update existing data
router.put(
  "/:iId",
  [
    dataMiddleware.aIdValidator,
    dataMiddleware.aDataValidator,
    dataMiddleware.validateReq,
  ],
  (req, res) => {
    dataController.updateData(req, res);
  }
);

//route for delete data
router.delete(
  "/:iId",
  [
    dataMiddleware.aIdValidator, 
    dataMiddleware.validateReq
  ],
  (req, res) => {
    dataController.deleteData(req, res);
  }
);

router.all("/*", (req, res) => {
  return createResponse(res, "NotFound", "Route not found !");
});

module.exports = router;
