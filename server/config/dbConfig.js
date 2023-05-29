const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected', () => {
	console.log('Mongoose connected to DB!');
});

db.on('error', (err) => {
	console.log('Mongo DB connection failed :(');
});

module.exports = db;
