const emitter = require("../utils/eventLog");
const { readFile, writeFile } = require("node:fs").promises;
const { v4: uuidv4 } = require("uuid");
const { date } = require("../helpers/date");
const { createResponse } = require("../helpers/response");
const sFilePath = "src/data.json";

async function getAllData(req, res) {
  try {
    let oGetData = await readFile(sFilePath, "utf-8");
    oData = JSON.parse(oGetData);
    oData = oData.filter((i) => i.sStatus === "available");
    return createResponse({ res, nStatusCode: 200, oData });
  } catch (err) {
    console.log(err.message);
    if (err) {
      if (err.code === "ENOENT") {
        return createResponse({
          res,
          nStatusCode: 404,
          bIsError: "File not found !",
        });
      } else {
        return createResponse({
          res,
          nStatusCode: 500,
          bIsError: "Internal server error !",
        });
      }
    }
  }
  //return createResponse({res,nStatusCode:200,sIsMessage:'yessss'})
}

async function getDataById(req, res) {
  try {
    const nId = req.params.iId;

    try {
      const oGetData = await readFile(sFilePath, "utf-8");
      let oData = JSON.parse(oGetData);
      const nGetId = oData.findIndex((i) => i.iId === nId);

      if (nGetId === -1) {
        return createResponse({
          res,
          nStatusCode: 404,
          sIsMessage: "Data not found !",
        });
      }

      oData = oData.filter((i) => i.iId === nId);
      return createResponse({ res, nStatusCode: 200, oData: oData });
    } catch (err) {
      console.log(err.message);
      if (err) {
        if (err.code === "ENOENT") {
          return createResponse({
            res,
            nStatusCode: 404,
            isError: "File not found !",
          });
        } else {
          return createResponse({
            res,
            nStatusCode: 500,
            isError: "Internal server error !",
          });
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    return createResponse({ res, nStatusCode: 500, isError: err.message });
  }
}

async function addData(req, res) {
  try {
    const oBody = req.body;

    try {
      const oGetData = await readFile(sFilePath, "utf-8");
      let oData = JSON.parse(oGetData);

      const oDataExist = oData.some((i) => i.sName === oBody.sName);

      if (oDataExist) {
        return createResponse({
          res,
          nStatusCode: 400,
          sIsMessage: "Data already exist with same product name !",
        });
      }

      oBody.iId = uuidv4();
      oBody.nCreatedAt = date();
      oBody.nUpdatedAt = date();

      oData.push(oBody);

      await writeFile(sFilePath, JSON.stringify(oData));
      emitter.emit("itemCreated", oBody);
      return createResponse({
        res,
        nStatusCode: 201,
        sIsMessage: "Item created successfully",
      });
    } catch (err) {
      console.log(err.message);
      if (err) {
        if (err.code === "ENOENT") {
          return createResponse({
            res,
            nStatusCode: 404,
            isError: "File not found",
          });
        } else {
          return createResponse({
            res,
            nStatusCode: 500,
            isError: "Internal server error",
          });
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    return createResponse({ res, nStatusCode: 500, isError: err.message });
  }
}

async function updateData(req, res) {
  try {
    const nId = req.params.iId;
    const oBody = req.body;

    try {
      let oGetData = await readFile(sFilePath, "utf-8");
      let oData = JSON.parse(oGetData);

      const nGetId = oData.findIndex((i) => i.iId === nId);

      if (nGetId === -1) {
        return createResponse({
          res,
          nStatusCode: 404,
          sIsMessage: "Data not found !",
        });
      }

      const oDataExist = oData.some((i) => i.sName === oBody.sName);

      if (oDataExist) {
        return createResponse({
          res,
          nStatusCode: 400,
          sIsMessage: "Data already exist with same product name !",
        });
      }

      oBody.iId = nId;
      oBody.nCreatedAt = oData[nGetId].nCreatedAt;
      oBody.nUpdatedAt = date();

      oData[nGetId] = { ...oData[nGetId], ...oBody };

      await writeFile(sFilePath, JSON.stringify(oData));

      emitter.emit("itemUpdated", oData[nGetId]);
      return createResponse({
        res,
        nStatusCode: 200,
        sIsMessage: "Item updated successfully !",
      });
    } catch (err) {
      console.log(err.message);
      if (err) {
        if (err.code === "ENOENT") {
          return createResponse({
            res,
            nStatusCode: 404,
            bIsError: "File not found !",
          });
        } else {
          return createResponse({
            res,
            nStatusCode: 500,
            bIsError: "Internal server error !",
          });
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    return createResponse({ res, nStatusCode: 500, bIsError: err.message });
  }
}

async function deleteData(req, res) {
  try {
    const nId = req.params.iId;

    try {
      let oGetData = await readFile(sFilePath, "utf-8");
      let oData = JSON.parse(oGetData);

      const nGetId = oData.findIndex((i) => i.iId === nId);

      if (nGetId === -1) {
        return createResponse({
          res,
          nStatusCode: 404,
          sIsMessage: "Data not found !",
        });
      }

      const oDeletedData = oData.filter((i) => i.iId === nId);
      oData = oData.filter((i) => i.iId !== nId);

      await writeFile(sFilePath, JSON.stringify(oData));
      emitter.emit("itemDeletd", oDeletedData);
      return createResponse({
        res,
        nStatusCode: 200,
        sIsMessage: "Item deleted successfully !",
      });
    } catch (err) {
      console.log(err.message);
      if (err) {
        if (err.code === "ENOENT") {
          createResponse({
            res,
            nStatusCode: 404,
            bIsError: "File not found !",
          });
        } else {
          createResponse({
            res,
            nStatusCode: 500,
            bIsError: "Internal server error !",
          });
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    return createResponse({ res, nStatusCode: 500, bIsError: err.message });
  }
}

module.exports = { getAllData, getDataById, addData, updateData, deleteData };
