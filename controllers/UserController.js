'use strict'
const EncryptionService = require('../services/encryption');
const User = require('../models/User');
const JwtService = require('../services/jwt');
const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const LogService = require('../services/log');
const FileUploader = require('../services/uploadFile');

function save(req, res){
    LogService('UserController save()');
    const newUser = new User();
    const params = req.body;

    if(!params.name || !params.surname || !params.password || !params.email){
        res.status(400).send({
            message: 'Missing parameters'
        });
        return;
    }

    newUser.name = params.name;
    newUser.surname = params.surname;
    newUser.email = String(params.email).toLowerCase();       
    newUser.role = 'ROLE_USER';
    newUser.image = 'null';
    newUser.password = EncryptionService.encrypt(params.password);

    newUser.save((err, user) => {
        if(err){
            console.log('ERR ',err);
            res.status(500).send({
                message: 'Error al guardar'
            });            
        }
        console.log(`New User saved! ID: ${user._id}`);

        res.status(201).send({
            code: constants.OK_CODE,
            user: user
        });
    });   

}

function login(req, res){
    LogService('UserController login()');
    const params = req.body;
    if(!params.email || !params.password){
        res.status(400).send({
            message: 'Missing parameters (email, password)'
        });
        return;
    }

    User.findOne({email: params.email}, (err, doc) => {
        if(err){
            res.status(400).send({
                message: 'Error al consultar usuario'
            });
            return;
        }

        if(!doc){
            res.status(404).send({
                message: 'El usuario no existe'
            });
            return;
        }

        if(EncryptionService.compare(params.password, doc.password)){
            res.status(200).send({
                code: constants.OK_CODE,
                token: JwtService.createToken(doc),
                user: doc
            });
        }else{
            res.status(200).send({
                message: 'Usuario o clave incorrecta.'
            }); 
        }
    });
}

function update(req, res){
    LogService('UserController update()');
    const userId = req.params.id;
    const userData = {
        name: req.body.name,
        surname: req.body.surname,
        role: req.body.role
    };

    User.findByIdAndUpdate(userId, userData, (err, updatedData) => {
        if(err){
            res.status(500).send({
                message: 'Error saving data'
            });
            return;
        }
        res.status(200).send({
            code: constants.OK_CODE,
            user: updatedData
        });
    });
}

function uploadImage(req, res){    
    const userId = req.params.id;
    LogService(`UserController uploadImage() user_id: ${userId}`);
    if(req.files){
        FileUploader
        .uploadFile(req.files.image, constants.IMAGE_TYPE)
        .then(fileName => {
            console.log(`User.findByIdAndUpdate ${userId} ${fileName}`);
            User.findByIdAndUpdate(userId, {image: fileName}, (err, updatedUser) => {
                if(err){
                    res.status(500).send({
                        message: 'Error saving image'
                    });
                }else{
                    res.status(200).send({
                        code: constants.OK_CODE,
                        userImage: fileName
                    });
                }
            });
        })
        .catch(e => {
            res.status(500).send({
                message: e.message
            });
        });
    }else{
        res.status(400).send({
            message: 'No file found'
        });
    }
}

function getImageFile(req, res){
    LogService('UserController getImageFile()');
    const fileName = req.params.fileName;
    const imagePath = `./uploads/images/users/${fileName}`;
    fs.exists(imagePath, (exists) => {
        if(exists){
            res.sendFile(path.resolve(imagePath));
        }else{
            res.status(404).send({
                message: 'File not found'
            });
        }
    });
}

module.exports = {
    save,
    login,
    update,
    uploadImage,
    getImageFile
}
