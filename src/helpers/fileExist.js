const { access } = require("node:fs").promises;

async function isFileExist(sFilePath) {
  try {
    await access(sFilePath);
    return true;
  } 
  catch (err) {
    return false;
  }
}

module.exports = { isFileExist };
