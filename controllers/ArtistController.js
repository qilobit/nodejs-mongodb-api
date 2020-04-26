'use strict'
const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const LogService = require('../services/log');

function get(req, res){
    LogService('ArtistController get()');
    const artistId = req.params.id;
    Artist.findById(artistId, (err, doc) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            res.status(200).send({
                code: constants.OK_CODE,
                artist: doc
            });
        }
    })
}

function getArtists(req, res){
    LogService('ArtistController getArtists()');
    const page = req.params.page || 1;
    const itemsPerPage = 4;

    Artist.paginate({}, { page: page, limit: itemsPerPage }, (err, artists) => {
        if(err){
            res.status(500).send({
                message: 'Error getting artists'
            });
        }else{
            console.log('Total items ',artists.total);
            res.status(200).send({
                data: artists
            });
        }
    });
}

function save(req, res){
    const params = req.body;
    const artist = new Artist();
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save((err, doc) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            if(!doc){
                res.status(500).send({
                    message: 'Error saving artist'
                });
            }else{
                res.status(200).send({
                    code: constants.OK_CODE,
                    artist: doc
                });
            }
        }
    });
}

function update(req, res){
    const artistId = req.params.id;
    const data = {
        name: req.body.name,
        description: req.body.description
    };
    console.log('UPDATE ARTIST: ',artistId);

    Artist.findByIdAndUpdate(artistId, data, (err, updatedData) => {
        if(err){
            res.status(500).send({
                message: 'Error updating artist'
            });
        }else{
            if(!updatedData){
                res.status(404).send({
                    message: 'Artist not found'
                });
            }else{
                res.status(200).send({
                    code: constants.OK_CODE,
                    artist: updatedData
                });
            }
        }
    });
}

function remove(req, res){
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, deletedDoc) => {
        if(err){
            res.status(500).send({
                message: 'Error removing artist'
            });
        }else{
            if(!deletedDoc){
                res.status(404).send({
                    message: 'Artist not found'
                }); 
            }else{
                Album.find({ artist: artistId }).remove((err, removedAlbum) => {
                    if(err){
                        res.status(500).send({
                            message: 'Error removing albums'
                        }); 
                    }else{
                        if(!removedAlbum){
                            res.status(500).send({
                                message: 'No album to remove'
                            }); 
                        }else{
                            Song.find({ album: removedAlbum._id }).remove((err, removedSong) => {
                                if(err){
                                    res.status(500).send({
                                        message: 'Error removing song'
                                    }); 
                                }else{
                                    if(!removedSong){
                                        res.status(500).send({
                                            message: 'No song to remove'
                                        }); 
                                    }else{
                                        res.status(200).send({
                                            code: constants.OK_CODE,
                                        }); 
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    const artistId = req.params.id;

    if(req.files){
        const filePath = req.files.image.path;
        const fileParts = filePath.split('\\');
        const fileName = fileParts[3];
        const fileNameSplit = fileName.split('\.');

        if(constants.validImageExtensions.includes(req.files.image.type)){
            Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, updatedArtist) => {
                if(err){
                    res.status(500).send({
                        message: 'Error saving image'
                    });
                }else{
                    res.status(200).send({
                        code: constants.OK_CODE,
                        artist: updatedArtist
                    });
                }
            });
        }else{
            fs.unlinkSync(filePath);
            res.status(400).send({
                message: 'Invalid file type'
            });
        }
    }else{
        res.status(400).send({
            message: 'No file found'
        });
    }
}

function getImageFile(req, res){
    const fileName = req.params.fileName;
    const imagePath = `./uploads/images/artists/${fileName}`;
    fs.exists(imagePath, (exists) => {
        if(exists){
            res.sendFile(path.resolve(imagePath));
        }else{
            res.status(404).send({
                message: 'File not found'
            });
        }
    });
}

module.exports = {
    get,
    save,
    getArtists,
    update,
    remove,
    uploadImage,
    getImageFile
}