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

/**
 * Returns a parameter map that stores parameters for verification functions
 * The order of the below lists are add -> list -> update -> get -> delete -> get
 * @param ids List of ids
 * @param resource_types List of resource types
 * @param statuses List of statuses
 * @param update_val The value to update
 * @param done The done function
 */
function create_params(ids, resource_types, statuses, update_val, done) {
    let params = {
        ids: ids,
        resource_types: resource_types,
        statuses: statuses,
        update_val: update_val,
        done: done
    };

    return params;
}

/**
 * Verifies all of the functions in order: add -> list -> update -> get -> delete -> get
 * @param ids List of ids
 * @param resource_types List of resource types
 * @param statuses List of statuses
 * @param update_val The value to update
 * @param done The done function
 */
function verify_all(ids, resource_types, statuses, update_val, done) {
    let params = create_params(ids, resource_types, statuses, update_val, done)
    verify_add(params);
}

/**
 * Verifies adding a new guideline
 * @param params The parameter (see above)
 */
function verify_add(params) {
    request
        .post(`/${params.resource_types[0]}`)
        .send({ id: params.ids[0] })
        .expect(params.statuses[0])
        .then((res) => {
            verify_list(params);
        });
}

/**
 * Verifies listing all guidelines
 * @param params The parameter (see above)
 */
function verify_list(params) {
    request.get(`/${params.resource_types[0]}`)
        .query({ resourceType: params.resource_types[1] })
        .expect(params.statuses[1])
        .then((res) => {
            if (params.statuses[1] == 200)
                expect(res.body.ids.sort()).toEqual([params.ids[1]]);
            verify_update(params);
        });
}

/**
 * Verifies updating a guideline
 * @param params The parameter (see above)
 */
function verify_update(params) {
    request.put(`/${params.resource_types[2]}/${params.ids[2]}`)
        .send({description: params.update_val})
        .expect(params.statuses[2])
        .then((res) => {
            if (params.statuses[2] == 200)
                expect(res.body.modifiedCount).toEqual(1);
            verify_get(params);
        });
}

/**
 * Verifies getting a new guideline
 * @param params The parameter (see above)
 */
function verify_get(params) {
    request.get(`/${params.resource_types[3]}/${params.ids[3]}`)
        .expect(params.statuses[3])
        .then((res4) => {
            if (params.statuses[3] == 200) {
                expect(res4.body.id).toEqual(params.ids[3]);

                if (params.statuses[2] == 200)
                    expect(res4.body.description).toEqual(params.update_val);
                else
                    expect(res4.body.description).not.toEqual(params.update_val);
            }
            verify_delete(params);
        });
}

/**
 * Verifies deleting a guideline
 * @param params The parameter (see above)
 */
function verify_delete(params) {
    request.delete(`/${params.resource_types[4]}/${params.ids[4]}`)
        .expect(params.statuses[4])
        .then((res5) => {
            if (params.statuses[4] == 200)
                expect(res5.body.modifiedCount).toEqual(1);
            request.get(`/${params.resource_types[5]}/${params.ids[5]}`).expect(params.statuses[5]).then(params.done());
        });
}

/**
 * Testing adding, listing, updating, getting and deleting an activity guideline.
 */
test("Add activity definition", (done) => {
    let test_id = 'test_act'
    let resource_type = app.ACTIVITY_RESOURCE_TYPE;
    let test_desc = 'test description for act'

    let ids = [test_id, test_id, test_id, test_id, test_id, test_id]
    let resource_types = [resource_type, resource_type, resource_type, resource_type, resource_type, resource_type]
    let statuses = [200, 200, 200, 200, 200, 404]

    verify_all(ids, resource_types, statuses, test_desc, done);
});


/**
 * Testing adding, listing, updating, getting and deleting a plan guideline.
 */
test("Add plan definition", (done) => {
    let test_id = 'test_plan'
    let resource_type = app.PLAN_RESOURCE_TYPE;
    let test_desc = 'test description for plan'

    let ids = [test_id, test_id, test_id, test_id, test_id, test_id]
    let resource_types = [resource_type, resource_type, resource_type, resource_type, resource_type, resource_type]
    let statuses = [200, 200, 200, 200, 200, 404]

    verify_all(ids, resource_types, statuses, test_desc, done);
});

/**
 * Testing adding, listing, updating, getting and deleting an activity guideline.
 * However, it has an invalid resource type
 */
test("Bad resource type", (done) => {
    let test_id = 'test_plan'
    let resource_type = 'not a valid resource type';
    let test_desc = 'test description for plan'

    let ids = [test_id, test_id, test_id, test_id, test_id, test_id]
    let resource_types = [resource_type, resource_type, resource_type, resource_type, resource_type, resource_type]
    let statuses = [400, 404, 400, 400, 400, 400]

    verify_all(ids, resource_types, statuses, test_desc, done);
});

/**
 * Testing adding, listing, updating, getting and deleting an activity guideline.
 * However, the update id is invalid.
 */
test("Invalid update", (done) => {
    let test_id = 'test_plan'
    let test_id_invalid = 'test_plan_invalid'
    let resource_type = app.PLAN_RESOURCE_TYPE;
    let test_desc = 'test description for plan'

    let ids = [test_id, test_id, test_id_invalid, test_id, test_id, test_id]
    let resource_types = [resource_type, resource_type, resource_type, resource_type, resource_type, resource_type]
    let statuses = [200, 200, 404, 200, 200, 404]

    verify_all(ids, resource_types, statuses, test_desc, done);
});

/**
 * Testing adding, listing, updating, getting and deleting an activity guideline.
 * However, we're adding duplicate guidelines.
 */
test("Adding duplicate", (done) => {
    let test_id = 'duplicate plan'
    let resource_type = app.PLAN_RESOURCE_TYPE;
    let test_desc = 'test description for plan'

    let ids = [test_id, test_id, test_id, test_id, test_id, test_id]
    let resource_types = [resource_type, resource_type, resource_type, resource_type, resource_type, resource_type]
    let statuses = [500, 200, 200, 200, 200, 404]
    
    request
        .post('/' + app.PLAN_RESOURCE_TYPE)
        .send({ id: test_id })
        .expect(200)
        .then ((res1) => {
            verify_all(ids, resource_types, statuses, test_desc, done);
        })
});



afterAll(async () => {
    await ActivityDefinition.deleteMany({});
    await PlanDefinition.deleteMany({});
    app.close();
})