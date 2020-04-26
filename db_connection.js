const mongoose = require('mongoose');
const config = require('config');
const connectionString = config.get('dbConfig.connectionString');
const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connect =  () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(connectionString, CONNECTION_OPTIONS, (err, res) => {
            if(err){
                reject(err);
            }else{
                resolve(true);
            }
        });        
    });
}

module.exports = connect;