const express = require('express');
const SongReproductionController = require('../controllers/SongReproductionController');
const api = express.Router();

api.post('/song/reproduction/save', SongReproductionController.save);
api.get('/song/reproductions/:songId', SongReproductionController.getPlays);

module.exports = api;
