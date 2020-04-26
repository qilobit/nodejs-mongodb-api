'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');
const albumRoutes = require('./routes/album');
const songRoutes = require('./routes/song');
const songReproductionRoutes = require('./routes/song_reproductions');
const playlistRoutes = require('./routes/playlist');
const cors = require('cors');
const app = express();
const SEND_FILE_OPTIONS = { root: './' };

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS');

//     next();
// });

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).sendFile('html/root.html', SEND_FILE_OPTIONS);
});
app.use('/api', userRoutes);
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);
app.use('/api', songRoutes);
app.use('/api', songReproductionRoutes);
app.use('/api', playlistRoutes);

module.exports = app;
