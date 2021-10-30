const server = require('../../app.js');
const supertest = require('supertest');
const request = supertest(server.app_server);

var activityModel;
var planModel;

jest.setTimeout(300000);

beforeAll(() => {
  activityModel = server.ActivityDefinition;
  planModel = server.PlanDefinition;
})

beforeEach(() => {
  activityModel.remove({}, function(err) {});
  planModel.remove({}, function(err) {});
})

test("Bad query", (done) => {
  request.get('/listDefinitions').query({ resourceType: 'wagwag' }) .expect(404, function(err, res) {
    expect(res.body.error).toEqual("Resource type invalid.");
    done();
  });
});

test("One activity", (done) => {
  var activity = new activityModel({ id: "ex1" });
  activity.save(function (err, activity) {
    if (err) return console.error(err);
  });

  var plan = new planModel({ id: "ex2" });
  plan.save(function (err, plan) {
    if (err) return console.error(err);
  });

  request.get('/listDefinitions').query({ resourceType: 'ActivityDefinition' }) .expect(200, function(err, res) {
    expect(res.body.ids.sort()).toEqual(["ex1"].sort());
  });

  request.get('/listDefinitions').query({ resourceType: 'PlanDefinition' }) .expect(200, function(err, res) {
    expect(res.body.ids.sort()).toEqual(["ex2"].sort());
    done();
  });
});

test("No activities", (done) => {
  request.get('/listDefinitions').query({ resourceType: 'ActivityDefinition' }) .expect(200, function(err, res) {
    expect(res.body.ids).toEqual([]);
  });

  request.get('/listDefinitions').query({ resourceType: 'PlanDefinition' }) .expect(200, function(err, res) {
    expect(res.body.ids).toEqual([]);
    done();
  });
});

afterAll(() => {
  server.close();
})