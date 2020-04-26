'use strict'

const Playlist = require('../models/Playlist');

function save(req, res){
    LogService('PlaylistController save()');
    const params = req.body;
    const playlist = new Playlist();

    playlist.name = params.name;
    playlist.user = params.user;
    playlist.songs = [];
    playlist.created_at = Date.now();

    playlist.save((err, doc) => {
        if(err){
            res.status(500).send({
                message: err
            });
        }else{
            if(!doc){
                res.status(500).send({
                    message: 'Error saving playlist'
                });
            }else{
                res.status(200).send({
                    code: constants.OK_CODE
                });
            }
        }
    });
}


module.exports = {
    save
}