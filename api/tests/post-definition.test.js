const server = require('../../app.js');
const supertest = require('supertest');
const request = supertest(server.app_server);

const { ActivityDefinition, PlanDefinition } = server;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(300000);

const RESOURCE_INVALID_MSG = 'Resource type invalid.';

beforeEach(() => {
	ActivityDefinition.deleteMany({}).catch((err) => {
		console.error(err);
	});
	PlanDefinition.deleteMany({}).catch((err) => {
		console.error(err);
	});
})

/**
 * Tests that a properly formatted POST to /ActivityDefinition returns 200 
 */
test("Invalid Resource Type", (done) => {
	request
	.post('/ActivityDefinition')
	.body({id: 'test'})
	.expect(200, (err, res) => {
		done();
	});
});

/**
 * Tests that a properly formatted POST to /PlanDefinition returns 200 
 */
 test("Invalid Resource Type", (done) => {
	request
	.post('/PlanDefinition')
	.body({id: 'test'})
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
	.body({id: 'test'})
	.expect(400, (err, res) => {
		expect(res.body.error);
		done();
	});
});

/**
 * Tests that a POST to root endpoint results in 400 error
 */
 test("Invalid Resource Type", (done) => {
	request
	.post('/')
	.body({id: 'test'})
	.expect(400, (err, res) => {
		expect(res.body.error);
		done();
	});
});

/**
 * Tests that a POST without required keys in body results in 400 error
 */
 test("Invalid Resource Type", (done) => {
	request
	.post('/')
	.body({i_am_not_important: 'test'})
	.expect(400, (err, res) => {
		expect(res.body.error);
		done();
	});
});

/**
 * Tests that a POST without with non-alphanumeric id results in 400 error
 */
 test("Invalid Resource Type", (done) => {
	request
	.post('/')
	.body({i_am_not_important: '$@($U)(*)(A @*!'})
	.expect(400, (err, res) => {
		expect(res.body.error);
		done();
	});
});

afterAll(() => {
	// Clears all data from db
	ActivityDefinition.deleteMany({});
	PlanDefinition.deleteMany({});
	server.close();
  })
