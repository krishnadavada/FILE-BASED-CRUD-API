const { createResponse } = require("../helpers/response");
const { validate: uuidValidate } = require("uuid");

function validateId(req, res, next) {
  if (!uuidValidate(req.params.iId)) {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid Id !",
    });
  }
  next();
}

function validateData(req, res, next) {
  if (
    !req.body.sName ||
    !req.body.nQuantity ||
    !req.body.nPrice ||
    !req.body.sStatus
  ) {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid data!",
    });
  } else if (typeof req.body.sName !== "string") {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid data type of name!",
    });
  } else if (typeof req.body.nQuantity !== "number") {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid data type of quantity!",
    });
  } else if (typeof req.body.nPrice !== "number") {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid data type of price!",
    });
  } else if (typeof req.body.sStatus !== "string") {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid data type of status!",
    });
  } else if (req.body.nQuantity < 0 || req.body.nPrice < 0) {
    return createResponse({
      res,
      nStatusCode: 400,
      sIsMessage: "Invalid quantity or price!",
    });
  }
  next();
}

module.exports = { validateId, validateData };
