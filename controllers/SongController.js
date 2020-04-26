'use strict'
const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const LogService = require('../services/log');

function get(req, res){
    LogService('SongController get()');
    const songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            res.status(200).send({
                song: song
            });
        }
    })
}

function getSongsByAlbum(req, res){
    LogService('SongController getSongs()');
    let query = null;

    if(req.params.albumId){
        query = Song.find({ album: req.params.albumId }).sort('name');
    }else{
        query = Song.find().sort('name');
    }

    query.populate({ path: 'album' }).exec((err, docs) => {
        if(err){
            res.status(500).send({
                message: 'Error getting albums'
            });
        }else{
            res.status(200).send({
                code: constants.OK_CODE,
                songs: docs
            });
        }
    });
}

function save(req, res){
    LogService('SongController save()');
    const params = req.body;
    const song = new Song();

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;
    song.reproductions = 0;

    song.save((err, doc) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            if(!doc){
                res.status(500).send({
                    message: 'Error saving song'
                });
            }else{
                res.status(200).send({
                    code: constants.OK_CODE,
                    song: doc
                });
            }
        }
    });
}

function update(req, res){
    LogService('SongController update()');
    const songId = req.params.id;

    Song.findByIdAndUpdate(songId, req.body, (err, updatedData) => {
        if(err){
            res.status(500).send({
                message: 'Error updating song'
            });
        }else{
            if(!updatedData){
                res.status(404).send({
                    message: 'Song not found'
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
    LogService('SongController remove()');
    const songId = req.params.id;

    Song.findById(songId).remove((err, removedSong) => {
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
function uploadFile(req, res){
    LogService('SongController uploadFile()');
    const songId = req.params.id;
    if(req.files){        
        if(req.files.song.size > 20_000_000){
            fs.unlinkSync(filePath);
            res.status(400).send({
                message: 'Max file size exceded (20 Mb)'
            });
            return;
        }
        FileUploader
        .uploadFile(req.files.song, constants.SOUND_TYPE)
        .then(fileName => {
            Song.findByIdAndUpdate(songId, {file: fileName}, (err, updatedSong) => {
                if(err){
                    res.status(500).send({
                        message: 'Error saving file'
                    });
                }else{
                    res.status(200).send({
                        code: constants.OK_CODE,
                        song: updatedSong
                    });
                }
            });
        })
        .catch(e => {
            res.status(500).send({
                message: e.message
            });
        });
    }else{
        res.status(400).send({
            message: 'No file found'
        });
    }
}
//TODO
function getFile(req, res){
    LogService('SongController getFile()');
    const fileName = req.params.fileName;
    const soundPath = `./uploads/songs/${fileName}`;
    fs.exists(soundPath, (exists) => {
        if(exists){
            res.sendFile(path.resolve(soundPath));
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
    getSongsByAlbum,
    update,
    remove,
    uploadFile,
    getFile
}