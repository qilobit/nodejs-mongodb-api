const express = require('express');
const SongController = require('../controllers/SongController');
const authMiddleware = require('../middlewares/authenticated');

const api = express.Router();
const multipart = require('connect-multiparty');
const soundUploadMiddleware = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', authMiddleware.ensureAuth, SongController.get);
api.post('/song/save', authMiddleware.ensureAuth, SongController.save);
//api.get('/song/:artistId?', authMiddleware.ensureAuth, SongController.getSongsByArtist);
api.get('/songs/:albumId?', authMiddleware.ensureAuth, SongController.getSongsByAlbum);
api.post('/song/update/:id', authMiddleware.ensureAuth, SongController.update);
api.delete('/song/:id', authMiddleware.ensureAuth, SongController.remove);
api.post('/song/upload-file/:id', [authMiddleware.ensureAuth, soundUploadMiddleware], SongController.uploadFile)
api.get('/song/get-file/:fileName', authMiddleware.ensureAuth, SongController.getFile)


module.exports = api;
