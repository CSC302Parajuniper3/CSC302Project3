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

test("Missing/empty body", (done) => {
  const mockActivityDefinitionId = `activity-example-administermedication`;
  const mockPlanDefinitionId = `chf-bodyweight`;
  const bodyDataError = "Body data has failed our validation and/or sanitation checks.";

  request.put(`/ActivityDefinition/${mockActivityDefinitionId}`)
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual(bodyDataError);
    });

  request.put(`/PlanDefinition/${mockPlanDefinitionId}`)
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual(bodyDataError);
    });

  request.put(`/ActivityDefinition/${mockActivityDefinitionId}`)
    .send({})
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual(bodyDataError);
    });

  request.put(`/PlanDefinition/${mockPlanDefinitionId}`)
    .send({})
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual(bodyDataError);
      done();
    });
});

test("Bad query", (done) => {
  const fakeId = `fakeid-${(Math.random() + 1).toString(36).substring(2)}`;
  
  request.put(`/bad-resource-type/${fakeId}`)
    .send({ description: "test update" })
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual("Invalid resourceType: bad-resource-type");
      done();
    });
});

test("Record not found", (done) => {
  const fakeId = `fakeid-${(Math.random() + 1).toString(36).substring(2)}`;

  request.put(`/ActivityDefinition/${fakeId}`)
    .send({ description: "test update" })
    .expect(404, function (err, res) {
      expect(res.body.error).toEqual(`Could not find requested ActivityDefinition with id: ${fakeId}`);
    });

  request.put(`/PlanDefinition/${fakeId}`)
    .send({ description: "test update" })
    .expect(404, function (err, res) {
      expect(res.body.error).toEqual(`Could not find requested PlanDefinition with id: ${fakeId}`);
      done();
    });
});

test("Activity record found", (done) => {
  const mockActivityDefinitionId = `activity-example-administermedication`;

  const mockActivityDefinition = ActivityDefinitionData.find(
    ActivityDefinition => ActivityDefinition.id === mockActivityDefinitionId
  );

  expect(mockActivityDefinition).toBeTruthy();
  expect(mockActivityDefinition.id).toEqual(mockActivityDefinitionId);

  request.put(`/ActivityDefinition/${mockActivityDefinitionId}`)
    .send({ description: "test update" })
    .expect(200, function (err, res) {
      expect(res.body.modifiedCount).toEqual(1);
      done();
    });
});

test("Plan record found", (done) => {
  const mockPlanDefinitionId = `chf-bodyweight`;

  const mockPlanDefinition = PlanDefinitionData.find(
    PlanDefinition => PlanDefinition.id === mockPlanDefinitionId
  );

  expect(mockPlanDefinition).toBeTruthy();
  expect(mockPlanDefinition.id).toEqual(mockPlanDefinitionId);

  request.put(`/PlanDefinition/${mockPlanDefinitionId}`)
    .send({ description: "test update" })
    .expect(200, function (err, res) {
      expect(res.body.modifiedCount).toEqual(1);
      done();
    });
});

afterAll(async () => {
  await ActivityDefinition.deleteMany({});
  await PlanDefinition.deleteMany({});
  app.close();
})