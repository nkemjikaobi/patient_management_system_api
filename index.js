let SERVER_NAME = 'patient-management-system-api';

require('dotenv').config();

let PORT = process.env.PORT;
let HOST = process.env.HOST;

const mongoose = require('mongoose');
let uristring = process.env.MONGO_DB_URI;

// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	// we're connected!
	console.log('Database connection has been established ' + uristring);
});

let errors = require('restify-errors');
const { v4: uuidv4 } = require('uuid');

const MedicationSchema = new mongoose.Schema({
	name: String,
	doctor: String,
	prescription: String,
	date_prescribed: String,
	id: String,
});

const TestSchema = new mongoose.Schema({
	name: String,
	id: String,
	value: String,
	test_date: String,
	notes: {
		type: String,
		default: '',
	},
});

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
	condition: {
		type: String,
		default: 'normal',
	},
	isAdmmitted: {
		type: Boolean,
		default: false,
	},
	tests: {
		type: [TestSchema],
		default: [],
	},
	medications: {
		type: [MedicationSchema],
		default: [],
	},
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patient' collection in the MongoDB database
let PatientModel = mongoose.model('Patients', PatientSchema);

let restify = require('restify'),
	// Create the restify server
	server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, function () {
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
	console.log(
		`   UPDATE PATIENT (method: PUT) => ${HOST}:${PORT}/patients/:id`
	);
	console.log('----------------------------');
	console.log(
		`   GET TESTS OF A PATIENT (method: GET) => ${HOST}:${PORT}/patients/:id/tests`
	);
	console.log(
		`   GET SINGLE TEST FOR A PATIENT (method: GET) => ${HOST}:${PORT}/patients/:id/tests/:test_id`
	);
	console.log(
		`   DELETE A TEST FROM A PATIENT (method: DELETE) => ${HOST}:${PORT}/patients/:id/tests/:test_id`
	);
	console.log(
		`   ADD NEW TEST TO A PATIENT (method: POST) => ${HOST}:${PORT}/patients/:id/tests`
	);
	console.log(
		`   UPDATE TEST OF A PATIENT (method: PUT) => ${HOST}:${PORT}/patients/:id/tests/:test_id`
	);
	console.log('----------------------------');
	console.log(
		`   GET MEDICATIONS OF A PATIENT (method: GET) => ${HOST}:${PORT}/patients/:id/medications`
	);
	console.log(
		`   GET SINGLE MEDICATION FOR A PATIENT (method: GET) => ${HOST}:${PORT}/patients/:id/medications/:medication_id`
	);
	console.log(
		`   DELETE A MEDICATION FROM A PATIENT (method: DELETE) => ${HOST}:${PORT}/patients/:id/medications/:medication_id`
	);
	console.log(
		`   ADD NEW MEDICATION TO A PATIENT (method: POST) => ${HOST}:${PORT}/patients/:id/medications`
	);
	console.log(
		`   UPDATE MEDICATION OF A PATIENT (method: PUT) => ${HOST}:${PORT}/patients/:id/medications/:medication_id`
	);
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

	// Create the patient and save to db
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

// Update patient info
server.put('/patients/:id', function (req, res, next) {
	console.log('UPDATE /patients/:id params=>' + JSON.stringify(req.params));

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

	// Update a  patient in the db
	PatientModel.findOneAndUpdate(
		{
			_id: req.params.id,
		},
		{
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
		}
	)
		.then(updatedPatient => {
			console.log('updated patient: ' + updatedPatient);
			if (updatedPatient) {
				res.send(200, {
					oldPatient: updatedPatient,
					message: 'Patient info updated',
				});
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

// Get all tests belonging to a patient in the system
server.get('/patients/:id/tests', function (req, res, next) {
	console.log('GET /patients/:id/tests params=>' + JSON.stringify(req.params));

	// Find a single patient by their id in db
	PatientModel.findOne({ _id: req.params.id })
		.then(patient => {
			console.log('Patient found: ' + patient);
			if (patient) {
				// Send the patient if no issues occurred
				if (patient.tests) {
					res.send(patient.tests);
				} else {
					// Send 404 header if the patient does not have any tests yet
					res.send(404);
				}
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

// Get a single test of a patient by using the patient id and test id
server.get('/patients/:id/tests/:test_id', function (req, res, next) {
	console.log(
		'GET /patients/:id/tests/:test_id params=>' + JSON.stringify(req.params)
	);

	// Find a single patient by their id in db
	PatientModel.findOne({ _id: req.params.id })
		.then(patient => {
			console.log('Patient found: ' + patient);
			if (patient) {
				// Find the test within the tests array of the patient using the test ID
				const test = patient.tests.find(test => test.id === req.params.test_id);

				if (test) {
					// If the test is found, send it as a response
					res.send(test);
				} else {
					// If the test is not found, send a 404 status
					res.sendStatus(404);
				}
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

// Delete a test from a patient
server.del('/patients/:id/tests/:test_id', function (req, res, next) {
	console.log(
		'DELETE /patients/tests/:test_id params=>' + JSON.stringify(req.params)
	);

	// Find a single patient by their id in the database
	PatientModel.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$pull: { tests: { id: req.params.test_id } }, // Remove the test with the specified test_id
		},
		{ new: true } // Return the modified patient document
	)
		.then(updatedPatient => {
			console.log('Patient found: ' + updatedPatient);
			if (updatedPatient) {
				// If the patient is found and the test is deleted, send the updated patient as a response
				res.send(updatedPatient);
			} else {
				// If the patient is not found, send a 404 status
				res.sendStatus(404);
			}
		})
		.catch(error => {
			console.log('Error: ' + error);
			return next(new Error(JSON.stringify(error.errors)));
		});
});

// Get all medications belonging to a patient in the system
server.get('/patients/:id/medications', function (req, res, next) {
	console.log(
		'GET /patients/:id/medications params=>' + JSON.stringify(req.params)
	);

	// Find a single patient by their id in db
	PatientModel.findOne({ _id: req.params.id })
		.then(patient => {
			console.log('Patient found: ' + patient);
			if (patient) {
				// Send the patient if no issues occurred
				if (patient.medications) {
					res.send(patient.medications);
				} else {
					// Send 404 header if the patient does not have any medications yet
					res.send(404);
				}
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

// Get a single medication of a patient by using the patient id and medication id
server.get(
	'/patients/:id/medications/:medication_id',
	function (req, res, next) {
		console.log(
			'GET /patients/:id/medications/:medication_id params=>' +
				JSON.stringify(req.params)
		);

		// Find a single patient by their id in db
		PatientModel.findOne({ _id: req.params.id })
			.then(patient => {
				console.log('Patient found: ' + patient);
				if (patient) {
					// Find the medication within the medications array of the patient using the medication ID
					const medication = patient.medications.find(
						medication => medication.id === req.params.medication_id
					);

					if (medication) {
						// If the medication is found, send it as a response
						res.send(medication);
					} else {
						// If the test is not found, send a 404 status
						res.sendStatus(404);
					}
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
	}
);

// Delete a medication from a patient
server.del(
	'/patients/:id/medications/:medication_id',
	function (req, res, next) {
		console.log(
			'DELETE /patientsmedications/:medication_id params=>' +
				JSON.stringify(req.params)
		);

		// Find a single patient by their id in the database
		PatientModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$pull: { medications: { id: req.params.medication_id } }, // Remove the medication with the specified test_id
			},
			{ new: true } // Return the modified patient document
		)
			.then(updatedPatient => {
				console.log('Patient found: ' + updatedPatient);
				if (updatedPatient) {
					// If the patient is found and the medication is deleted, send the updated patient as a response
					res.send(updatedPatient);
				} else {
					// If the patient is not found, send a 404 status
					res.sendStatus(404);
				}
			})
			.catch(error => {
				console.log('Error: ' + error);
				return next(new Error(JSON.stringify(error.errors)));
			});
	}
);
