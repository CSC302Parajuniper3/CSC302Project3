const app = require('../../app.js');
const supertest = require('supertest');
const request = supertest(app.app_server);
const { ActivityDefinition, PlanDefinition } = app;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(10000);

beforeAll(async () => {
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
  
  request.delete(`/bad-resource-type/${fakeId}`)
    .send({ description: "test delete" })
    .expect(400, function (err, res) {
      expect(res.body.error).toEqual("Invalid resourceType: bad-resource-type");
      done();
    });
});

test("Record not found", (done) => {
  const fakeId = `fakeid-${(Math.random() + 1).toString(36).substring(2)}`;

  request.delete(`/ActivityDefinition/${fakeId}`)
    .send({ description: "test delete" })
    .expect(404, function (err, res) {
      expect(res.body.error).toEqual(`Could not find requested ActivityDefinition with id: ${fakeId}`);
    });

  request.delete(`/PlanDefinition/${fakeId}`)
    .send({ description: "test delete" })
    .expect(404, function (err, res) {
      expect(res.body.error).toEqual(`Could not find requested PlanDefinition with id: ${fakeId}`);
      done();
    });
});

test("Activity record found and deleted", (done) => {
  const mockActivityDefinitionId = `activity-example-administermedication`;

  const mockActivityDefinition = ActivityDefinitionData.find(
    ActivityDefinition => ActivityDefinition.id === mockActivityDefinitionId
  );

  expect(mockActivityDefinition).toBeTruthy();
  expect(mockActivityDefinition.id).toEqual(mockActivityDefinitionId);

  request.delete(`/ActivityDefinition/${mockActivityDefinitionId}`)
    .send({ description: "test delete" })
    .expect(200, function (err, res) {
      expect(res.body.modifiedCount).toEqual(1);
      request.get(`/ActivityDefinition/${mockActivityDefinitionId}`)
        .expect(404, function (err, res) {
          expect(res.body.error).toEqual(`Could not find requested ActivityDefinition with id: ${mockActivityDefinitionId}`);
          done();
        });
    });
});

test("Plan record found and deleted", (done) => {
  const mockPlanDefinitionId = `chf-bodyweight`;

  const mockPlanDefinition = PlanDefinitionData.find(
    PlanDefinition => PlanDefinition.id === mockPlanDefinitionId
  );

  expect(mockPlanDefinition).toBeTruthy();
  expect(mockPlanDefinition.id).toEqual(mockPlanDefinitionId);

  request.delete(`/PlanDefinition/${mockPlanDefinitionId}`)
    .send({ description: "test delete" })
    .expect(200, function (err, res) {
      expect(res.body.modifiedCount).toEqual(1);
      request.get(`/PlanDefinition/${mockPlanDefinitionId}`)
        .expect(404, function (err, res) {
          expect(res.body.error).toEqual(`Could not find requested PlanDefinition with id: ${mockPlanDefinitionId}`);
          done();
        });
    });
});

afterAll(async () => {
  await ActivityDefinition.deleteMany({});
  await PlanDefinition.deleteMany({});
  app.close();
})
