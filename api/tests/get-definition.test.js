const app = require('../../app.js');
const supertest = require('supertest');
const request = supertest(app.app_server);
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(300000);

beforeAll(() => {
  // todo: clear and insert mock data into db
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

  // todo: mock endpoints and uncomment
  // request.get(`/ActivityDefinition/${mockActivityDefinitionId}`).expect(200, function(err, res) {
  //   expect(res.body).toEqual(mockActivityDefinition);
  // });

  // request.get(`/PlanDefinition/${mockPlanDefinitionId}`).expect(200, function(err, res) {
  //   expect(res.body).toEqual(mockPlanDefinition);
    done();
  // });
});

afterAll(() => {
  app.close();
})