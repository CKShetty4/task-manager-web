const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.MONGODB_URI ;

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB Atlas successfully :)");
    })
    .catch((e) => {
        console.error("Error while attempting to connect to MongoDB:", e);
    });

module.exports = {
    mongoose
};