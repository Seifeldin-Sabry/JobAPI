const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD)

module.exports = async () => {
    mongoose.connect(DB)
    .then(con => {
    console.log('DB CONNECTION SUCCESS')
});
}