'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = Schema({
    number: Number,
    name: String,
    duration: String,
    file: String,
    reproductions: Number,
    album: {
        type: Schema.ObjectId,
        ref: 'album'
    }
});

module.exports = mongoose.model('song', SongSchema);
