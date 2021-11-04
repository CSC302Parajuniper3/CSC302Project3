const app = require('../../app.js');
const supertest = require('supertest');
const request = supertest(app.app_server);
const { ActivityDefinition, PlanDefinition } = app;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(10000);

beforeAll(async () => {
  // clear and insert mock data into db
  await ActivityDefinition.deleteMany({}).catch((err) => {
    console.error(err);
  });
  await PlanDefinition.deleteMany({}).catch((err) => {
    console.error(err);
  });

  const activitiesToInsert = [];
  for (activityMock of ActivityDefinitionData) {
    activitiesToInsert.push(new ActivityDefinition(activityMock));
  }
  ActivityDefinition.insertMany(activitiesToInsert).catch((err) => {
    console.error(err);
  });

  const plansToInsert = [];
  for (planMock of PlanDefinitionData) {
    plansToInsert.push(new PlanDefinition(planMock));
  }
  PlanDefinition.insertMany(plansToInsert).catch((err) => {
    return console.error(err);
  });
})

test("Bad query", (done) => {
  const fakeId = `fakeid-${(Math.random() + 1).toString(36).substring(2)}`;
  request.get(`/bad-resource-type/${fakeId}`).expect(400, function (err, res) {
    expect(res.body.error).toEqual("Invalid resourceType: bad-resource-type");
    done();
  });
});

test("Record not found", (done) => {
  const fakeId = `fakeid-${(Math.random() + 1).toString(36).substring(2)}`;

  request.get(`/ActivityDefinition/${fakeId}`).expect(404, function (err, res) {
    expect(res.body.error).toEqual(`Could not find requested ActivityDefinition with id: ${fakeId}`);
  });

  request.get(`/PlanDefinition/${fakeId}`).expect(404, function (err, res) {
    expect(res.body.error).toEqual(`Could not find requested PlanDefinition with id: ${fakeId}`);
    done();
  });
});

test("Record found", (done) => {
  const mockActivityDefinitionId = `activity-example-administermedication`;
  const mockPlanDefinitionId = `chf-bodyweight`;

  const mockActivityDefinition = ActivityDefinitionData.find(
    ActivityDefinition => ActivityDefinition.id === mockActivityDefinitionId
  );

  const mockPlanDefinition = PlanDefinitionData.find(
    PlanDefinition => PlanDefinition.id === mockPlanDefinitionId
  );

  expect(mockActivityDefinition).toBeTruthy();
  expect(mockActivityDefinition.id).toEqual(mockActivityDefinitionId);

  expect(mockPlanDefinition).toBeTruthy();
  expect(mockPlanDefinition.id).toEqual(mockPlanDefinitionId);

  request.get(`/ActivityDefinition/${mockActivityDefinitionId}`).expect(200, function (err, res) {
    expect(res.body.id).toEqual(mockActivityDefinition.id);
  });

  request.get(`/PlanDefinition/${mockPlanDefinitionId}`).expect(200, function (err, res) {
    expect(res.body.id).toEqual(mockPlanDefinition.id);
    done();
  });
});

afterAll(async () => {
  await ActivityDefinition.deleteMany({});
  await PlanDefinition.deleteMany({});
  app.close();
})