const server = require('../../app.js');
const supertest = require('supertest');
const request = supertest(server.app_server);

const { ActivityDefinition, PlanDefinition } = server;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(10000);

const RESOURCE_INVALID_MSG = 'Resource type invalid.';

beforeEach(async () => {
	await ActivityDefinition.deleteMany({}).catch((err) => {
		console.error(err);
	});
	await PlanDefinition.deleteMany({}).catch((err) => {
		console.error(err);
	});
})

/**
 * Tests that a properly formatted POST to /ActivityDefinition returns 200 
 */
test("Activity insert success", (done) => {
	request
		.post('/ActivityDefinition')
		.send({ id: 'test' })
		.expect(200, (err, res) => {
			done();
		});
});

/**
 * Tests that a properly formatted POST to /PlanDefinition returns 200 
 */
test("Plan insert success", (done) => {
	request
		.post('/PlanDefinition')
		.send({ id: 'test' })
		.expect(200, (err, res) => {
			done();
		});
});

/**
 * Tests that a POST to an invalid_type endpoint results in 400 error
 */
test("Invalid Resource Type", (done) => {
	request
		.post('/invalid_type')
		.send({ id: 'test' })
		.expect(400, (err, res) => {
			expect(res.body.error);
			done();
		});
});

/**
 * Tests that a POST to root endpoint results in 400 error
 */
test("Root request", (done) => {
	request
		.post('/')
		.send({ id: 'test' })
		.expect(400, (err, res) => {
			expect(res.body.error);
			done();
		});
});

/**
 * Tests that a POST without required keys in body results in 400 error
 */
test("Missing body keys", (done) => {
	request
		.post('/')
		.send({ i_am_not_important: 'test' })
		.expect(400, (err, res) => {
			expect(res.body.error);
			done();
		});
});

afterAll(async () => {
	// Clears all data from db
	await ActivityDefinition.deleteMany({});
	await PlanDefinition.deleteMany({});
	server.close();
})
