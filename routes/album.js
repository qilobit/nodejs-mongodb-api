const express = require('express');
const AlbumController = require('../controllers/AlbumController');
const authMiddleware = require('../middlewares/authenticated');

const api = express.Router();
const multipart = require('connect-multiparty');
const imageUploadMiddleware = multipart({ uploadDir: './uploads/images/albums' });

api.get('/album/:id', authMiddleware.ensureAuth, AlbumController.get);
api.post('/album/save', authMiddleware.ensureAuth, AlbumController.save);
api.get('/albums/:artistId?', authMiddleware.ensureAuth, AlbumController.getAlbums);
api.post('/album/update/:id', authMiddleware.ensureAuth, AlbumController.update);
api.delete('/album/:id', authMiddleware.ensureAuth, AlbumController.remove);
api.post('/album/upload-image/:id', [authMiddleware.ensureAuth, imageUploadMiddleware], AlbumController.uploadImage)
api.get('/album/get-image/:fileName', AlbumController.getImageFile)


module.exports = api;
