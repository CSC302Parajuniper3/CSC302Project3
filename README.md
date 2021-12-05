# CSC302Project3
Description: An online collection for existing digital medical guidelines in FHIR format, with an API that allows other apps to retrieve them. Full API documentation can be found at the end of this file.


## Where to find our documentation and meeting notes

### Repo Layout

```
api/
    mock-data/
      ActivityDefinition/
      PlanDefinition/
    services/
    tests/
meeting-notes/
documents/
models/
```

* Entry point > `app.js` located in the top level directory
* Backend > `api/` folder containing routes, services and tests for the API
* Data > `models/` folder containing mongoose database schemas for our library

---

### Tech Stack and Decisions:

Tech stack and their decisions can be found in the `Tech Stack.md` file under the `documents` folder in the top level directory of the repo.

---

### Project development plan:

The project development plan can be found in the `Milestones.md` file under the `documents` folder in the top level directory of the repo.

---

### Assignment 3 Results:

The project development plan can be found in the `Asssignment3.md` file under the `documents` folder in the top level directory of the repo.

---

### Meeting Notes

Meeting notes can be found in the `meeting-notes` folder in the top level directory of the repo.

---

### What are your validation, verification, and acceptance criteria as agreed to with your industry partners, and where is your understanding of those criteria demonstrated in the code.

These points are discussed in Assignment3.md under “Features” and “How have the acceptance criteria been met?”

---


## Docker
Or, **"How do we <build/run/test> our project in one click?"**
### **Pre-requisites**
This project uses `Docker` and `docker-compose` to containerize and deploy the application. Please ensure you have `docker`, `docker-compose`, and `docker-engine` installed on your machine. If not, follow the steps in the following links: https://docs.docker.com/engine/install/ and https://docs.docker.com/compose/install/

Also please ensure that the docker service is running. If it is not running, you can launch it on Linux machines with the command `sudo systemctl start docker`. If you are not running Linux, please search online for further instructions.

### Building and Running

Once docker is running, simply build and run the project:

    docker-compose up <target>

Here are some examples

    docker-compose up e_dev
    docker-compose up db
    docker-compose up e_dev db

This will automatically build an image if one does not exist, and then run the application. If you see errors regarding permissions, try running `sudo docker-compose up e_dev`

By using `docker-compose up -d <target>`, docker will run the application in the background as a daemon.

If you want to force a build, add the `--build` argument before the target. If you want to build without running, use the command `docker-compose build`

Note: You want to include db if you're using e_dev/e_test/e_prod, as they all require the db.

You can also run every target with the command below. Note that this means it runs both development AND production simultaneously.

    docker-compose up

### Targets

The docker-compose configuration contains seperate targets for test, development/staging, and production builds. To run one of these builds, simply use the commands:

    docker-compose up [commands] <target>

Here are is the list of all currently available targets:

+ `db`     -- MongoDB database
+ `e_test` -- Test build for express.js server.
+ `e_dev`  -- Development build for express.js server.
+ `e_prod` -- Production build for express.js server.

---

## How to verify that our project works?

Do not use the -d option in this case.

Run with your test/dev/prod target and the db target.

Currently, you should see the output `"I am running a test!"` if you're running `e_test db` or `"I am running!"` if you're running `e_dev db'.

If you run 'e_test', you should see an execution of the unit tests. They should all pass.

If you run 'e_dev', you should be able to use the endpoints from Postman.

---

## Troubleshooting

- If you get the following error while deploying: `Error while fetching server API version` then your issue might be permission issues with docker's socket. Run the (Linux) command `sudo chmod 666 /var/run/docker.sock`, which may solve the issue.

- If you get the following error: `error checking context: 'no permission to read from '.../db_data/WiredTiger.turtle'`, then you need to change the permissions of the `db_data` folder. Run the linux command `sudo chmod -R 777 /path/to/db_data` to fix the issue. This is a common issue with running `docker-compose up --build e_test`.
---

## Heroku

We are using heroku to deploy our app.

You can access the webpage using the following link: https://parajuniper-guidelines.herokuapp.com/

There is currently a blank page with the text "Hello World!"

---

## Available Manual Scripts

In the project directory, you can manually run the following commands to install/run/test our project using npm.
***However**, we would prefer using Docker (see above) to run/build/test our project. This is included for documentation purposes only.*

### `npm install`

Installs all dependencies required for the project to run.

### `npm start`

Runs the project on the local machine.

### `npm test`

Runs the test suites of the project.

---
# API Documentation

## Endpoints:

### **/::resourceType::**
- Parameters
  - `resourceType`:
    - Type of resource to retrieve
    - Values: <**ActivityDefinition**||**PlanDefinition**>
- **GET**
  - Returns a list of defintion ids of the specified type or an empty [] if none 
  - Status Codes
    - **200**: Request OK
    - **404**: resource type invalid.
    - **500**: internal error if model can't be found.
  -
        GET /PlanDefinition HTTP/1.1
        -------------------------------------
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        
        {"ids":["test"]}
- **POST**
  - Endpoint to create a new guideline in the DB. Returns copy of newly created guideline.
  - Body
    - Request MUST contain a body containing the record data in JSON format. The precise formatting for this data can be found in the [Schemas](###Schemas) section of this document.
  - Status Codes
    - **200**: Request OK
    - **400**: params or body was incorrectly formatted / missing data.
    - **500**: internal error if model can't be found or data can not be saved
  -
        POST /PlanDefinition HTTP/1.1
        Content-Type: application/json
        
        {
        "id": "test",
        "resourceType": "PlanDefinition",
        "url": "http://example.com",
        "name": "J. Doe",
        "title": "My Record",
        "status": "In Progress",
        "date": "2017-09-04",
        "publisher": "Company Inc.",
        "description": "This is a mock record for use as in API documentation"
        }
        -------------------------------------
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        
        {"id":"test","resourceType":"PlanDefinition","extension":[],"url":"http://example.com","version":"1.0.0","name":"J. Doe","title":"My Record","status":"In Progress","date":"2017-09-04T00:00:00.000Z","updated":"2021-12-04T04:32:50.138Z","publisher":"Company Inc.","description":"This is a mock record for use as in API documentation","jurisdiction":[],"goal":[],"action":[],"deleted":null,"_id":"61aaef72e48d8fd0ceea3eb6","__v":0}

### **/::resourceType::/::id::**
- Parameters 
  - `resourceType`
    - Type of resource
    - Values: <**ActivityDefinition**||**PlanDefinition**>
  - `id` 
    - Resource ID
- **GET**
  - Endpoint to retrieve a guideline JSON from the DB
  - Status Codes
    - **200**: Request OK
    - **400**: params incorrectly used (e.g. incorrect resource type)
    - **404**: specified record id cannot be found
    - **500**: internal error if model can't be found or data can not be fetched
  -
        GET /PlanDefinition/test HTTP/1.1
        -------------------------------------
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        
        {"_id":"61aaef72e48d8fd0ceea3eb6","id":"test","resourceType":"PlanDefinition","extension":[],"url":"http://example.com","version":"1.0.0","name":"J. Doe","title":"My Record","status":"In Progress","date":"2017-09-04T00:00:00.000Z","updated":"2021-12-04T04:32:50.138Z","publisher":"Company Inc.","description":"This is a mock record for use as in API documentation","jurisdiction":[],"goal":[],"action":[],"deleted":null,"__v":0}
- **PUT** 
  - Endpoint to update an existing guideline record in the DB
  - Body
    - Request MUST contain a body containing the updated record data in JSON format. Not all fields are required; only the fields that will be updated need to be supplied
  - Status Codes
    - **200**: Request OK
    - **400**: params or body incorrectly set (e.g. incorrect resource type, empty body JSON)
    - **404**: specified record id cannot be found
    - **500**: internal error if model can't be found or data can not be updated
  -
        PUT /PlanDefinition/test HTTP/1.1
        Content-Type: application/json
        
        {
        "title": "A Brand New Record"
        }
        -------------------------------------
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        
        {"acknowledged":true,"modifiedCount":1,"upsertedId":null,"upsertedCount":0,"matchedCount":1}
- **DELETE** 
  - Endpoint to delete a guideline record in the DB.
  - Status Codes
    - **200**: Request OK
    - **404**: specified record id cannot be found
    - **500**: internal error if model can't be found or data can not be updated
  -
        DELETE /PlanDefinition/test HTTP/1.1
        -------------------------------------
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8

        {"acknowledged":true,"modifiedCount":1,"upsertedId":null,"upsertedCount":0,"matchedCount":1}

## Schemas

### **ActivityDefinition**
    id: {
      type: String,
      minLength: 1,
      unique: true,
      required: true
    },
    resourceType: {
      type: String,
      minLength: 10,
      default: "ActivityDefinition"
    },
    meta: {},
    extension: [],
    url: String,
    version: { 
      type: String, 
      default: "1.0.0"
    },
    name: String,
    title: String,
    status: String,
    experimental: Boolean,
    date: Date,
    updated: {
      type: Date,
      default: Date.now()
    },
    publisher: String,
    description: String,
    jurisdiction: [],
    kind: String,
    profile: String,
    code: {},
    intent: String,
    doNotPerform: Boolean,
    dynamicValue: [],
    deleted: {
      type: Date,
      default: null
    }

### **PlanDefinition**
    id: {
      type: String,
      minLength: 1,
      unique: true,
      required: true
    },
    resourceType: {
      type: String,
      minLength: 10,
      default: "PlanDefinition"
    },
    meta: {},
    extension: [],
    url: String,
    version: { 
      type: String, 
      default: "1.0.0"
    },
    name: String,
    title: String,
    type: {},
    status: String,
    experimental: Boolean,
    date: Date,
    updated: {
      type: Date,
      default: Date.now()
    },
    publisher: String,
    description: String,
    jurisdiction: [],
    goal: [],
    action: [],
    deleted: {
      type: Date,
      default: null
    }
