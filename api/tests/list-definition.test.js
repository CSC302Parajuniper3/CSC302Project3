const server = require('../../app.js');
const supertest = require('supertest');
const request = supertest(server.app_server);

const { ActivityDefinition, PlanDefinition } = server;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(10000);

const RESOURCE_INVALID_MSG = 'Resource type invalid.';

const act_resource = server.ACTIVITY_RESOURCE_TYPE;
const plan_resource = server.PLAN_RESOURCE_TYPE;

beforeEach(async () => {
  // Clears all data from db
  await ActivityDefinition.deleteMany({}).catch((err) => {
    console.error(err);
  });
  await PlanDefinition.deleteMany({}).catch((err) => {
    console.error(err);
  });
})

/**
 * Tests /listDefinitions using a req with an invalid query string
 */
test("Bad query", (done) => {
  const INVALID_RESOURCE_TYPE = 'invalid';

  request.get('/listDefinitions').query({ resourceType: INVALID_RESOURCE_TYPE }).expect(404, function (err, res) {
    expect(res.body.error).toEqual(RESOURCE_INVALID_MSG);
    done();
  });
});

/**
 * Tests /listDefinitions using a req wwith a resource type of the wrong datatype.
 */
test("Bad type query", (done) => {
  let bad_query = 1234;

  request.get(`/${bad_query}`).query({ resourceType: bad_query }).expect(404, done);
});

/**
 * Tests using an invalid query with no query string
 */
test("No query", (done) => {
  request.get(`/`).expect(404, done);
});

/**
 * Initalizes the db with NUM_ENTRIES activity and plan definitions.
 * Ensures all entries are in the response.
 */
test("Many activities", (done) => {
  const NUM_ENTRIES = 10;
  const ACT_PREFIX = 'activity';
  const PLAN_PREFIX = 'plan';

  const activityList = [];
  const planList = [];
  for (let i = 0; i < NUM_ENTRIES; ++i) {
    const activity = new ActivityDefinition({ id: ACT_PREFIX + i });
    activityList.push(activity);

    const plan = new PlanDefinition({ id: PLAN_PREFIX + i });
    planList.push(plan);
  }

  Promise.all([ActivityDefinition.insertMany(activityList), PlanDefinition.insertMany(planList)]).then(
    () => {
      let expectedActivity = []
      let expectedPlan = []
      for (let i = 0; i < NUM_ENTRIES; ++i) {
        expectedActivity.push(ACT_PREFIX + i);
        expectedPlan.push(PLAN_PREFIX + i);
      }

      request.get(`/${act_resource}`).query({ resourceType: act_resource }).expect(200, function (err, res) {
        expect(res.body.ids.sort()).toEqual(expectedActivity.sort());
      });

      request.get(`/${plan_resource}`).query({ resourceType: plan_resource }).expect(200, function (err, res) {
        expect(res.body.ids.sort()).toEqual(expectedPlan.sort());
        done();
      });
    });
});

/**
 * Initalizes the db with a single activity and plan definition.
 * Ensures all entries are in the response.
 */
test("One activity", (done) => {
  const ACT_DEF_1 = "ex1";
  const PLAN_DEF_1 = "ex2";

  const RES_ACT_BODY = [ACT_DEF_1]
  const RES_PLAN_BODY = [PLAN_DEF_1]

  var activity = new ActivityDefinition({ id: ACT_DEF_1 });
  activity.save(function (err, activity) {
    if (err) return console.error(err);
  });

  var plan = new PlanDefinition({ id: PLAN_DEF_1 });
  plan.save(function (err, plan) {
    if (err) return console.error(err);
  });

  request.get(`/${act_resource}`).query({ resourceType: act_resource }).expect(200, function (err, res) {
    expect(res.body.ids.sort()).toEqual(RES_ACT_BODY.sort());
  });

  request.get(`/${plan_resource}`).query({ resourceType: plan_resource }).expect(200, function (err, res) {
    expect(res.body.ids.sort()).toEqual(RES_PLAN_BODY.sort());
    done();
  });
});

/**
 * Initalizes the db with no activity and plan definitions.
 * Ensures that the response is empty/
 */
test("No activities", (done) => {
  request.get(`/${act_resource}`).query({ resourceType: act_resource }).expect(200, function (err, res) {
    expect(res.body.ids).toEqual([]);
  });

  request.get(`/${plan_resource}`).query({ resourceType: plan_resource }).expect(200, function (err, res) {
    expect(res.body.ids).toEqual([]);
    done();
  });
});

afterAll(async () => {
  // Clears all data from db
  await ActivityDefinition.deleteMany({});
  await PlanDefinition.deleteMany({});
  server.close();
})