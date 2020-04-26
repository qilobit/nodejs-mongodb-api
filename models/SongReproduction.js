'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongReproductionSchema = Schema({
    song: String,
    date: String,
    user: String
});

module.exports = mongoose.model('song_reproductions', SongReproductionSchema);
