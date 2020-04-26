const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authenticated');

const api = express.Router();
const multipart = require('connect-multiparty');
const imageUploadMiddleware = multipart({ uploadDir: './uploads/images/users', limit: '10mb', maxFieldsSize: '10mb'});

api.post('/register', UserController.save);
api.post('/login', UserController.login);
api.put('/user/update/:id', authMiddleware.ensureAuth, UserController.update);
api.post('/user/upload-image/:id', [authMiddleware.ensureAuth, imageUploadMiddleware], UserController.uploadImage)
api.get('/user/get-image/:fileName', UserController.getImageFile)

module.exports = api;
