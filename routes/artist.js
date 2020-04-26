const express = require('express');
const ArtistController = require('../controllers/ArtistController');
const authMiddleware = require('../middlewares/authenticated');

const api = express.Router();
const multipart = require('connect-multiparty');
const imageUploadMiddleware = multipart({ uploadDir: './uploads/images/artists' });

api.get('/artist/:id', authMiddleware.ensureAuth, ArtistController.get);
api.post('/artist/save', authMiddleware.ensureAuth, ArtistController.save);
api.get('/artists/:page', authMiddleware.ensureAuth, ArtistController.getArtists);
api.post('/artist/update/:id', authMiddleware.ensureAuth, ArtistController.update);
api.delete('/artist/:id', authMiddleware.ensureAuth, ArtistController.remove);
api.post('/artist/upload-image/:id', [authMiddleware.ensureAuth, imageUploadMiddleware], ArtistController.uploadImage)
api.get('/artist/get-image/:fileName', ArtistController.getImageFile)

module.exports = api;
