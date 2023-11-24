//Get all the imports
let chai = require('chai');
let chaiHttp = require('chai-http');

let expect = chai.expect;

//Register chai http
chai.use(chaiHttp);

// define base uri for the Patient Management API
const uri = '127.0.0.1:7500';

describe("when we issue a 'GET' to /patients", function () {
	// Make a GET request to /patients
	it('should return HTTP 200', function (done) {
		chai
			.request(uri)
			.get('/patients')
			.end(function (req, res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
});

describe("when we issue a 'GET' to /patients", function () {
	// Make a GET request to /patients
	it('should return empty list []', function (done) {
		chai
			.request(uri)
			.get('/patients')
			.end(function (req, res) {
				expect(res.text).to.equal('[]');
				done();
			});
	});
});

describe("when we issue a 'POST' to /patients with patient info", function () {
	// describe("when we issue a 'POST' to /patients with patient info", function () {
	let createdPatientId;

	it('should return response with patient created', function (done) {
		chai
			.request(uri)
			.post('/patients')
			.field('first_name', 'Nkemjika')
			.field('last_name', 'Obi')
			.field('gender', 'male')
			.field('date_of_birth', '12-12-1995')
			.field('genotype', 'AA')
			.field('blood_group', 'A+')
			.field('email', ' nkemjikaobi@gmail.com')
			.field('phone_number', '4326789843')
			.field('house_address', '23, Progress Avenue, Toronto')
			.field('department', 'Emergency')
			.field('doctor', 'Dr. Walter Whyte')
			.end(function (req, res) {
				createdPatientId = res.body._id;
				expect(res.status).to.equal(201);
				expect(res.text).to.equal(
					`{"first_name":"Nkemjika","last_name":"Obi","gender":"male","date_of_birth":"12-12-1995","genotype":"AA","blood_group":"A+","email":" nkemjikaobi@gmail.com","phone_number":"4326789843","house_address":"23, Progress Avenue, Toronto","department":"Emergency","doctor":"Dr. Walter Whyte","condition":"normal","isAdmitted":false,"_id":"${res.body._id}","tests":[],"medications":[],"__v":0}`
				);
				done();
			});
	});

	it('should retrieve the details of the created patient', function (done) {
		// Make a GET request to /patients/:id using the _id of the created patient
		chai
			.request(uri)
			.get(`/patients/${createdPatientId}`)
			.end(function (req, res) {
				expect(res.status).to.equal(200);
				expect(res.text).to.equal(
					`{"_id":"${createdPatientId}","first_name":"Nkemjika","last_name":"Obi","gender":"male","date_of_birth":"12-12-1995","genotype":"AA","blood_group":"A+","email":" nkemjikaobi@gmail.com","phone_number":"4326789843","house_address":"23, Progress Avenue, Toronto","department":"Emergency","doctor":"Dr. Walter Whyte","condition":"normal","isAdmitted":false,"tests":[],"medications":[],"__v":0}`
				);
				done();
			});
	});

	it('should retrieve the tests of the created patient', function (done) {
		// Make a GET request to /patients/:id/tests using the _id of the created patient
		chai
			.request(uri)
			.get(`/patients/${createdPatientId}/tests`)
			.end(function (req, res) {
				expect(res.status).to.equal(200);
				expect(res.text).to.equal(`[]`);
				done();
			});
	});

	it('should return the newly created tests of the created patient', function (done) {
		// Make a POST request to /patients/:id/tests using the _id of the created patient
		chai
			.request(uri)
			.post(`/patients/${createdPatientId}/tests`)
			.field('name', 'Blood Pressure')
			.field('value', 9)
			.field('test_date', '12-11-2023')
			.end(function (req, res) {
				console.log(res.text);
				expect(res.status).to.equal(201);
				done();
			});
	});

	it('should retrieve the medications of the created patient', function (done) {
		// Make a GET request to /patients/:id/medications using the _id of the created patient
		chai
			.request(uri)
			.get(`/patients/${createdPatientId}/medications`)
			.end(function (req, res) {
				expect(res.status).to.equal(200);
				expect(res.text).to.equal(`[]`);
				done();
			});
	});

	it('should return the newly created medications of the created patient', function (done) {
		// Make a POST request to /patients/:id/medications using the _id of the created patient
		chai
			.request(uri)
			.post(`/patients/${createdPatientId}/medications`)
			.field('name', 'Malaria Medicine')
			.field('doctor', 'Dr Rania Abesh')
			.field('prescription', '2 tablets daily')
			.field('date_prescribed', '11-12-2023')
			.end(function (req, res) {
				console.log(res.text);
				expect(res.status).to.equal(201);
				done();
			});
	});

	it('should delete the patient', function (done) {
		// Make a DELETE request to /patients/:id using the _id of the created patient
		chai
			.request(uri)
			.delete(`/patients/${createdPatientId}`)
			.end(function (req, res) {
				expect(res.status).to.equal(200);
				done();
			});
	});

	it('should return empty list when we refetch all the patients', function (done) {
		// Make a GET request to /patients
		chai
			.request(uri)
			.get('/patients')
			.end(function (req, res) {
				expect(res.text).to.equal('[]');
				done();
			});
	});
});
