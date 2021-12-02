const app = require('../../app.js');
const supertest = require('supertest');
const request = supertest(app.app_server);
const { ActivityDefinition, PlanDefinition } = app;
const { ActivityDefinitionData, PlanDefinitionData } = require('../mock-data');

jest.setTimeout(10000);

beforeEach(async () => {
    // Clears all data from db
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

    request
        .post('/' + app.ACTIVITY_RESOURCE_TYPE)
        .send({ id: test_id })
        .expect(200)
        .then ((res1) => {
            request.get('/listDefinitions')
                .query({ resourceType: app.ACTIVITY_RESOURCE_TYPE })
                .expect(200)
                .then((res2) => {
                    expect(res2.body.ids.sort()).toEqual([test_id]);
                    request.put(`/ActivityDefinition/${test_id}`)
                        .send({description: test_desc})
                        .expect(200)
                        .then((res3) => {
                            expect(res3.body.modifiedCount).toEqual(1);
                            request.get(`/ActivityDefinition/${test_id}`)
                                .expect(200).then((res4) => {
                                expect(res4.body.id).toEqual(test_id);
                                expect(res4.body.description).toEqual(test_desc);
                                // Do delete here.
                                done();

                            })
                        });
                });
        })
});

test("Add plan definition", (done) => {
    let test_id = 'test'
    let test_desc = 'test description'

    request
        .post('/' + app.PLAN_RESOURCE_TYPE)
        .send({ id: test_id })
        .expect(200)
        .then ((res1) => {
            request.get('/listDefinitions')
                .query({ resourceType: app.PLAN_RESOURCE_TYPE })
                .expect(200)
                .then((res2) => {
                    expect(res2.body.ids.sort()).toEqual([test_id]);
                    request.put(`/PlanDefinition/${test_id}`)
                        .send({description: test_desc})
                        .expect(200)
                        .then((res3) => {
                            expect(res3.body.modifiedCount).toEqual(1);
                            request.get(`/PlanDefinition/${test_id}`)
                                .expect(200).then((res4) => {
                                expect(res4.body.id).toEqual(test_id);
                                expect(res4.body.description).toEqual(test_desc);
                                // Do delete here.
                                done();

                            })
                        });
                });
        })
});

test("Bad query", (done) => {
    let test_id = 'test'
    let test_desc = 'test description'

    request
        .post('/notadefinition')
        .send({ id: test_id })
        .expect(400)
        .then ((res1) => {
            request.get('/listDefinitions')
                .query({ resourceType: 'notadefinition' })
                .expect(404)
                .then((res2) => {
                    request.put(`/notadefinition/${test_id}`)
                        .send({description: test_desc})
                        .expect(400)
                        .then((res3) => {
                            request.get(`/notadefinition/${test_id}`).expect(400);
                            done();
                        });
                });
        })
});

test("Invalid update", (done) => {
    let test_id = 'test'
    let test_id_invalid = 'test2'
    let test_desc = 'test description'

    request
        .post('/' + app.PLAN_RESOURCE_TYPE)
        .send({ id: test_id })
        .expect(200)
        .then ((res1) => {
            request.get('/listDefinitions')
                .query({ resourceType: app.PLAN_RESOURCE_TYPE })
                .expect(200)
                .then((res2) => {
                    expect(res2.body.ids.sort()).toEqual([test_id]);
                    request.put(`/PlanDefinition/${test_id_invalid}`)
                        .send({description: test_desc})
                        .expect(404)
                        .then((res3) => {
                            request.get(`/PlanDefinition/${test_id}`)
                                .expect(200).then((res4) => {
                                expect(res4.body.id).toEqual(test_id);
                                expect(res4.body.description).not.toEqual(test_desc);
                                // Do delete here.
                                done();

                            })
                        });
                });
        })
});

test("Adding duplicate", (done) => {
    let test_id = 'test'
    let test_id_invalid = 'test2'
    let test_desc = 'test description'

    request
        .post('/' + app.PLAN_RESOURCE_TYPE)
        .send({ id: test_id })
        .expect(200)
        .then ((res1) => {
            request
                .post('/' + app.PLAN_RESOURCE_TYPE)
                .send({ id: test_id })
                .expect(500)
                .then((res2) => {
                    request.get('/listDefinitions')
                        .query({ resourceType: app.PLAN_RESOURCE_TYPE })
                        .expect(200)
                        .then((res3) => {
                            expect(res3.body.ids.sort()).toEqual([test_id]);
                            done();
                        });
                });
        })
});


afterAll(async () => {
    await ActivityDefinition.deleteMany({});
    await PlanDefinition.deleteMany({});
    app.close();
})