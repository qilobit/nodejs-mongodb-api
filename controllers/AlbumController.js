'use strict'
const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const Album = require('../models/Album');
const Song = require('../models/Song');
const LogService = require('../services/log');

function get(req, res){
    LogService('AlbumController get()');
    const albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            res.status(200).send({
                code: constants.OK_CODE,
                album: album
            });
        }
    })
}

function getAlbums(req, res){
    LogService('AlbumController getAlbums()');
    let query = null;

    if(req.params.artistId){
        console.log('getAlbums artist: ',req.params.artistId);
        query = Album.find({ artist: req.params.artistId }).sort('name');
    }else{
        query = Album.find().sort('name');
    }

    query.populate({ path: 'artist' }).exec((err, docs) => {
        if(err){
            res.status(500).send({
                message: 'Error getting albums'
            });
        }else{
            res.status(200).send({
                code: constants.OK_CODE,
                albums: docs
            });
        }
    });
}

function save(req, res){
    LogService('AlbumController save()');
    const params = req.body;
    const album = new Album();
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save((err, doc) => {
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
                    album: doc
                });
            }
        }
    });
}

function update(req, res){
    LogService('AlbumController update()');
    const albumId = req.params.id;
    const data = {
        title: req.body.title,
        description: req.body.description
    };

    Album.findByIdAndUpdate(albumId, data, (err, updatedData) => {
        if(err){
            res.status(500).send({
                message: 'Error updating album'
            });
        }else{
            if(!updatedData){
                res.status(404).send({
                    message: 'Album not found'
                });
            }else{
                res.status(200).send({
                    code: constants.OK_CODE,
                    album: updatedData
                });
            }
        }
    });
}

function remove(req, res){
    LogService('AlbumController remove()');
    const albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, deletedDoc) => {
        if(err){
            res.status(500).send({
                message: 'Error removing album'
            });
        }else{
            if(!deletedDoc){
                res.status(500).send({
                    message: 'No album to remove'
                }); 
            }else{
                Song.find({ album: deletedDoc._id }).remove((err, removedSong) => {
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
//TODO
function uploadImage(req, res){
    LogService('AlbumController uploadImage()');
    const albumId = req.params.id;

    if(req.files){
        const filePath = req.files.image.path;
        const fileParts = filePath.split('\\');
        const fileName = fileParts[3];
        const fileNameSplit = fileName.split('\.');

        if(constants.validImageExtensions.includes(req.files.image.type)){
            Album.findByIdAndUpdate(albumId, {image: fileName}, (err, album) => {
                if(err){
                    res.status(500).send({
                        message: 'Error saving image'
                    });
                }else{
                    res.status(200).send({
                        code: constants.OK_CODE,
                        album: album
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
//TODO
function getImageFile(req, res){
    LogService('AlbumController getImageFile()');
    const fileName = req.params.fileName;
    const imagePath = `./uploads/images/albums/${fileName}`;
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
    getAlbums,
    update,
    remove,
    uploadImage,
    getImageFile
}