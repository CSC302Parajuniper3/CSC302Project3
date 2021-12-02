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
})

test("Add activity definition", (done) => {
    let test_id = 'test'
    let test_desc = 'test description'

    // Adding the test guideline
  request
      .post('/' + app.ACTIVITY_RESOURCE_TYPE)
      .send({ id: test_id })
      .expect(200, (err, res) => {
        done();
      });

    // Ensures it exists when retriving list of all guidelines
  request.get('/listDefinitions').query({ resourceType: app.ACTIVITY_RESOURCE_TYPE }).expect(200, function (err, res) {
    expect(res.body.ids.sort()).toEqual([test_id]);
  });

  // Updates the description
  request.put(`/ActivityDefinition/${test_id}`)
      .send({ description: test_desc })
      .expect(200, function (err, res) {
        expect(res.body.modifiedCount).toEqual(1);
        done();
      });

  // Gets the guideline and checks the description was updated.
  request.get(`/ActivityDefinition/${test_id}`)
      .expect(200, function (err, res) {
          expect(res.body.id).toEqual(test_id);
          expect(res.body.description).toEqual(test_desc);
        done();
      });

});

afterAll(async () => {
    await ActivityDefinition.deleteMany({});
    await PlanDefinition.deleteMany({});
    app.close();
})