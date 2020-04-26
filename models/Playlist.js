'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = Schema({
    name: String,
    songs : [{ type: Schema.ObjectId, ref: 'song', required: true }],
    user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    created_at: Schema.Types.Date
});

module.exports = mongoose.model('playlist', PlaylistSchema);
