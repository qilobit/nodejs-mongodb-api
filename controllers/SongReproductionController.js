'use strict'

const SongReproduction = require('../models/SongReproduction');

function save(req, res){
    LogService('SongReproductionController save()');
    const params = req.body;
    const songReproduction = new SongReproduction();

    songReproduction.song = params.song;
    songReproduction.user = params.user || null;
    songReproduction.date = Date.now();

    songReproduction.save((err, doc) => {
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
                    message: 'ok'
                });
            }
        }
    });
}

function getPlays(req, res){
    LogService('SongReproductionController getPlays()');
    const songId = req.params.songId;

    SongReproduction.find({ song: songId }).count((err, totalPlays) => {
        if(err){
            res.status(500).send({
                message: err                
            });
        }else{
            res.status(200).send({
                code: constants.OK_CODE,
                total_plays: totalPlays
            });
        }
    });
}   

module.exports = {
    save,
    getPlays
}