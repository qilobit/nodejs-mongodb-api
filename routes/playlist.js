const express = require('express');
const PlaylistController = require('../controllers/PlaylistController');
const authMiddleware = require('../middlewares/authenticated');

const api = express.Router();

api.post('/playlist/save', authMiddleware.ensureAuth, PlaylistController.save);

module.exports = api;
