'use strict';
const os = require('os');
const constants = require('../constants');
const LogService = require('./log');

async function uploadFile(file, type){
  const separator = getFileSeparator();
  const fileParts = file.path.split(separator);
  const fileName = fileParts[ fileParts.length - 1 ];//file name is at the last position
  
  if(typeof type === 'undefined'){
    throw 'Missing parameter "type"';
  }
  const validExtensions = type == constants.IMAGE_TYPE
    ? constants.validImageExtensions
    : constants.validSoundExtensions;
    
  if(validExtensions.includes(file.type)){
    LogService(`FILE SAVED ${fileName}`);
    return Promise.resolve(fileName);
  }else{
    fs.unlinkSync(file.path);
    return Promise.reject('Invalid file type');
  }
}

function getFileSeparator(){
  return os.platform() == 'win32'
    ? '\\'
    : '/';
}

module.exports = {
  uploadFile
}