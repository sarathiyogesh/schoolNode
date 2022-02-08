const dotenv = require('dotenv');
const mongoose = require('mongoose');


process.on('unCaughtRejection', err => {
	console.log('unCaughtRejection', err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.NODE_ENV === 'production'?process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSOWRD):process.env.DATABASE_LOCAL;

mongoose.connect(DB,{
    useNewUrlParser: true,
   // useFindAndModify: false,
    useUnifiedTopology: true
  }).then(con => {
  	//console.log(con.connections);
  	console.log(process.env.NODE_ENV + ' database connection successful!');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
	console.log(`App Running on port ${port}`);
});

process.on('unhandledRejection', err => {
	console.log('unhandledRejection', err.name, err.message);
	server.close( () => {
		process.exit(1);
	});
});
//exports.app;