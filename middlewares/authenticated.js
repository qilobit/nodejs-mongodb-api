'use strict'

const JwtService = require('../services/jwt');
const moment = require('moment');

function ensureAuth(req, res, next){
    if(!req.headers.authorization){
        res.status(403).send({
            message: 'Peticion no autorizada'
        });
        return;
    }
    const token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        const payload = JwtService.decode(token);

        if(payload.exp <= moment().unix()){
            res.status(403).send({
                message: 'Token expirado'
            });
            return;
        }

    } catch (error) {
        console.log('AUTH MIDDLEWARE ',error);
        res.status(403).send({
            message: 'Token invalido'
        });
        return;
    }

    next();
}

module.exports = {
    ensureAuth
}