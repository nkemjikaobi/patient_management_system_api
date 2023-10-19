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
	first_name: String,
	last_name: String,
	gender: String,
	date_of_birth: String,
	genotype: String,
	blood_group: String,
	email: String,
	phone_number: String,
	house_address: String,
	department: String,
	doctor: String,
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

// Get all patients in the system
server.get('/patients', function (req, res, next) {
	console.log('GET /patients params=>' + JSON.stringify(req.params));

	// Find every patient in db
	PatientModel.find({})
		.then(patients => {
			// Return all of the patients in the system
			res.send(patients);
			return next();
		})
		.catch(error => {
			return next(new Error(JSON.stringify(error.errors)));
		});
});

// Get a single patient by using the patient id
server.get('/patients/:id', function (req, res, next) {
	console.log('GET /patients/:id params=>' + JSON.stringify(req.params));

	// Find a single patient by their id in db
	PatientModel.findOne({ _id: req.params.id })
		.then(patient => {
			console.log('Patient found: ' + patient);
			if (patient) {
				// Send the patient if no issues occurred
				res.send(patient);
			} else {
				// Send 404 header if the patient doesn't exist
				res.send(404);
			}
			return next();
		})
		.catch(error => {
			console.log('error: ' + error);
			return next(new Error(JSON.stringify(error.errors)));
		});
});
