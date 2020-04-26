const fs = require('fs');
const DateService = require('../services/date');
const FILE_PATH = 'api_log.txt';

function saveToText(text){
  try {
    fs.appendFileSync(FILE_PATH, `${text}\n`);
  } catch (error) {
    console.log('ERROR saveToText ',error);
  }
  return 1;
}

module.exports = (method) => {
  const text = `[${DateService.timestamp()}] ${method}`;
  saveToText(text);
  console.log(text);
}