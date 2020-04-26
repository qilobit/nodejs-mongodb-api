'use strict'

const jwtSimple = require('jwt-simple');
const moment = require('moment');
const config = require('config');
const secret = config.get('jwtSecret');

function createToken(user){
    let payload = user;
    payload.iat = moment().unix();
    payload.exp = moment().add(15, 'days').unix

    return jwtSimple.encode(payload, secret);
}

function decode(token){
    return jwtSimple.decode(token, secret);
}

module.exports = {
    createToken,
    decode
}