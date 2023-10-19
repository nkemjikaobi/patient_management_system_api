let SERVER_NAME = 'patient-management-system-api';
let PORT = 7500;
let HOST = '127.0.0.1';

const mongoose = require('mongoose');
let uristring =
	'mongodb+srv://admin:EKxrUzfnb5K4hJMA@cluster0.evqs7we.mongodb.net/?retryWrites=true&w=majority';

// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	// we're connected!
	console.log('Database connection has been established ' + uristring);
});

let errors = require('restify-errors');

const PatientSchema = new mongoose.Schema({
	name: String,
	age: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patient' collection in the MongoDB database
let PatientModel = mongoose.model('Patients', PatientSchema);

let restify = require('restify'),
	// Create the restify server
	server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
	console.log('Server %s listening at %s', server.name, server.url);
	console.log('**** Resources: ****');
	console.log('********************');
	console.log('Endpoints:');
	console.log('----------------------------');
	console.log(`   GET PATIENTS (method: GET) => ${HOST}:${PORT}/patients`);
	console.log(
		`   GET SINGLE PATIENT (method: GET) => ${HOST}:${PORT}/patients/:id`
	);
	console.log(
		`   DELETE A PATIENT (method: DELETE) => ${HOST}:${PORT}/patients/:id`
	);
	console.log(`   ADD NEW PATIENT (method: POST) => ${HOST}:${PORT}/patients`);
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());
