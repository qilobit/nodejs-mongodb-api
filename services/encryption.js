'use strict'
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

function encrypt(value){
    return bcrypt.hashSync(value, salt);
}
function compare(value, hash){
    return bcrypt.compareSync(value, hash);
}
module.exports = {
    encrypt,
    compare
}

