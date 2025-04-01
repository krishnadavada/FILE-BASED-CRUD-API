const emitter = require("../utils/eventLog");
const { readFile, writeFile } = require("node:fs").promises;
const { v4: uuidv4 } = require("uuid");
const { date } = require("../helpers/date");
const { createResponse } = require("../helpers/response");
const { isFileExist } = require("../helpers/fileExist");
const { status } = require("../utils/enums");
const sFilePath = "src/data.json";

//function for get all data and shows item that is available
async function getAllData(req, res) {
  try {

    //check file exist or not
    if (!(await isFileExist(sFilePath))) {
      return createResponse( res, "NotFound", 'not_found','File');
    }

    const oGetData = await readFile(sFilePath, "utf-8");
    oData = JSON.parse(oGetData);

    //filter data that is available
    oData = oData.filter((i) => i.sStatus === (status.available || status.Available));
    return createResponse( res, 'OK', 'fetch' , null , oData);

  } 
  catch (err) {

    console.log(err);
    return createResponse( res, 'InternalServerError','internal_err' );

  }
}

//function for get data by id
async function getDataById(req, res) {
  try {

    //check file exist or not
    if (!(await isFileExist(sFilePath))) {
      return createResponse(res, 'NotFound','not_found','File' );
    }

    const { iId } = req.params;

    const oGetData = await readFile(sFilePath, "utf-8");
    let oData = JSON.parse(oGetData);

    //find index for given id
    const nGetId = oData.findIndex((i) => i.iId === iId);

    //check that data with given id is exist or not
    if (nGetId === -1) {
      return createResponse(res, 'NotFound', 'not_found','Data');
    }

    oData = oData.filter((i) => i.iId === iId);
    return createResponse(res, 'OK',  'fetch',null, oData);

  }
  catch (err) {

    console.log(err);
    return createResponse(res, 'InternalServerError','internal_err');

  }
}

//function for add new data
async function addData(req, res) {
  try {

    //check file exist or not
    if (!(await isFileExist(sFilePath))) {
      return createResponse(res, 'NotFound','not_found','File');
    }

    const oBody = req.body;

    const oGetData = await readFile(sFilePath, "utf-8");
    const oData = JSON.parse(oGetData);

    const oDataExist = oData.some((i) => i.sName === oBody.sName);

    //check that same name data exist or not
    if (oDataExist) {
      return createResponse(res, 'BadRequest', 'name_exist');
    }

    oBody.iId = uuidv4();
    oBody.dCreatedAt = date();
    oBody.dUpdatedAt = date();

    oData.push(oBody);

    //push data into file by writeFile
    await writeFile(sFilePath, JSON.stringify(oData));

    //when item created then below event is emit
    emitter.emit("itemCreated", oBody);

    return createResponse(res, 'Created','success','created', oBody);

  } 
  catch (err) {

    console.log(err);
    return createResponse(res, 'InternalServerError', 'internal_err');

  }
}

//function for update existing data
async function updateData(req, res) {
  try {
    //check file exist or not
    if (!(await isFileExist(sFilePath))) {
      return createResponse(res, 'NotFound','not_found','File');
    }

    //extract iId from params
    const { iId } = req.params;

    //extract request body into oBody
    const oBody = req.body;

    const oGetData = await readFile(sFilePath, "utf-8");
    const oData = JSON.parse(oGetData);

    const nGetId = oData.findIndex((i) => i.iId === iId);

    //check that data with given id is exist or not
    if (nGetId === -1) {
      return createResponse(res, 'NotFound','not_found','Data');
    }

    const oDataExist = oData.some((i) => i.sName === oBody.sName);

    //check that data with same name exist or not
    if (oDataExist && oBody.sName!==oData[nGetId].sName) {
      return createResponse(res, 'BadRequest', 'name_exist');
    }

    oBody.iId = iId;
    oBody.dCreatedAt = oData[nGetId].dCreatedAt;
    oBody.dUpdatedAt = date();

    oData[nGetId] = { ...oData[nGetId], ...oBody };

    //push updated oData into file by writeFile
    await writeFile(sFilePath, JSON.stringify(oData));

    //when item updated then below event is emit
    emitter.emit("itemUpdated", oData[nGetId]);

    return createResponse(res, 'OK', 'success','updated', oData[nGetId]);
  } catch (err) {
    console.log(err);
    return createResponse(res, 'InternalServerError', 'internal_err');
  }
}

//function for delete data by id
async function deleteData(req, res) {
  try {

    //check file exist or not
    if (!(await isFileExist(sFilePath))) {
      return createResponse(res,'NotFound','not_found','File');
    }

    //extract id from request params
    const { iId } = req.params;

    const oGetData = await readFile(sFilePath, "utf-8");
    let oData = JSON.parse(oGetData);

    const nGetId = oData.findIndex((i) => i.iId === iId);

    //check that data with given id is exist or not
    if (nGetId === -1) {
      return createResponse(res, 'NotFound','not_found','Data');
    }

    const oDeletedData = oData.filter((i) => i.iId === iId);
    oData = oData.filter((i) => i.iId !== iId);

    //push updated oData into file by writeFile
    await writeFile(sFilePath, JSON.stringify(oData));

    //when item deleted below event is emit
    emitter.emit("itemDeletd", oDeletedData);

    return createResponse(res, 'OK','success','deleted',oDeletedData );

  }
  catch (err) {

    console.log(err);
    return createResponse(res,'InternalServerError','internal_err');
    
  }
}

module.exports = { getAllData, getDataById, addData, updateData, deleteData };
