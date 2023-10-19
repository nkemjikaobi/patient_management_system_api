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

// Create a new patient
server.post('/patients', function (req, res, next) {
	console.log('POST /patients params=>' + JSON.stringify(req.params));
	console.log('POST /patients body=>' + JSON.stringify(req.body));

	// validation of manadatory fields
	if (req.body.first_name === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('first name must be supplied'));
	}
	if (req.body.last_name === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('last name must be supplied'));
	}
	if (req.body.gender === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('gender must be supplied'));
	}
	if (req.body.date_of_birth === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('date of birth must be supplied'));
	}
	if (req.body.genotype === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('genotype must be supplied'));
	}
	if (req.body.blood_group === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('blood group must be supplied'));
	}
	if (req.body.email === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('email must be supplied'));
	}

	if (req.body.phone_number === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('phone number must be supplied'));
	}
	if (req.body.house_address === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('house address must be supplied'));
	}
	if (req.body.department === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('department must be supplied'));
	}
	if (req.body.doctor === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new errors.BadRequestError('doctor must be supplied'));
	}

	let newPatient = new PatientModel({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		gender: req.body.gender,
		date_of_birth: req.body.date_of_birth,
		genotype: req.body.genotype,
		blood_group: req.body.blood_group,
		email: req.body.email,
		phone_number: req.body.phone_number,
		house_address: req.body.house_address,
		department: req.body.department,
		doctor: req.body.doctor,
	});

	// Create the user and save to db
	newPatient
		.save()
		.then(patient => {
			console.log('saved patient: ' + patient);
			// Send the patient if no issues
			res.send(201, patient);
			return next();
		})
		.catch(error => {
			console.log('error: ' + error);
			return next(new Error(JSON.stringify(error.errors)));
		});
});

// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {
	console.log('DELETE /patients params=>' + JSON.stringify(req.params));
	// Delete the patient in db
	PatientModel.findOneAndDelete({ _id: req.params.id })
		.then(deletedPatient => {
			console.log('deleted patient: ' + deletedPatient);
			if (deletedPatient) {
				res.send(200, deletedPatient);
			} else {
				res.send(404, 'Patient not found');
			}
			return next();
		})
		.catch(error => {
			console.log('error: ' + error);
			return next(new Error(JSON.stringify(error.errors)));
		});
});
