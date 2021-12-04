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

function verify_all(id, resource_type, update_val, done) {
    params = {
        id: id,
        resource_type: resource_type,
        update_val: update_val,
        done: done
    }

    verify_add(params);
}

function verify_add(params) {
    request
        .post(`/${params.resource_type}`)
        .send({ id: params.id })
        .expect(200)
        .then((res) => {
            verify_list(params);
        });
}

function verify_list(params) {
    request.get('/listDefinitions')
        .query({ resourceType: params.resource_type })
        .expect(200)
        .then((res) => {
            expect(res.body.ids.sort()).toEqual([params.id]);
            verify_update(params);
        });
}

function verify_update(params) {
    request.put(`/${params.resource_type}/${params.id}`)
        .send({description: params.update_val})
        .expect(200)
        .then((res) => {
            expect(res.body.modifiedCount).toEqual(1);
            verify_get(params);
        });
}

function verify_get(params) {
    request.get(`/${params.resource_type}/${params.id}`)
        .expect(200)
        .then((res4) => {
            expect(res4.body.id).toEqual(params.id);
            expect(res4.body.description).toEqual(params.update_val);
            verify_delete(params);
        });
}

function verify_delete(params) {
    request.delete(`/${params.resource_type}/${params.id}`)
        .expect(200)
        .then((res5) => {
            expect(res5.body.modifiedCount).toEqual(1);
            request.get(`/${params.resource_type}/${params.id}`).expect(404).then(params.done());
        });
}

test("Add activity definition", (done) => {
    let test_id = 'test_act'
    let test_desc = 'test description for act'

    verify_all(test_id, app.ACTIVITY_RESOURCE_TYPE, test_desc, done);
});

test("Add plan definition", (done) => {
    let test_id = 'test_plan'
    let test_desc = 'test description for plan'

    verify_all(test_id, app.PLAN_RESOURCE_TYPE, test_desc, done);
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
                                .expect(200)
                                .then((res4) => {
                                    expect(res4.body.id).toEqual(test_id);
                                    expect(res4.body.description).not.toEqual(test_desc);

                                    request.delete(`/PlanDefinition/${test_id}`)
                                        .expect(200)
                                        .then((res5) => {
                                            expect(res5.body.modifiedCount).toEqual(1);
                                            request.get(`/PlanDefinition/${test_id}`).expect(404).then(done());
                                        });

                                });
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