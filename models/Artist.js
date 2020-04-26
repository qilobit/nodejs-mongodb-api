'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

ArtistSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('artist', ArtistSchema);
