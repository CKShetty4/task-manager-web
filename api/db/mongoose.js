const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TaskManager')
    .then(() => {
        console.log("Connected to MongoDB successfully :)");
    })
    .catch((e) => {
        console.error("Error while attempting to connect to MongoDB:", e);
    });

module.exports = {
    mongoose
};
