# CSC302Project3
A library for existing digital medical guidelines in FHIR format that allows other apps to retrieve them

---

## Layout

```
api/
    routes/
    services/
    tests/
meeting-notes/
models/
scripts/
```

* Entry point > `app.js` located in the top level directory
* Backend > `api/` folder containing routes, services and tests for the API
* Data > `models/` folder containing mongoose database schemas for our library
* Execution > `scripts/` folder with scripts for running and testing the app

---

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all dependencies required for the project to run.

### `npm start`

Runs the project on the local machine.

### `npm test`

Runs the test suites of the project.

---

## Tech stack summary and decision log:

Selected options are in **bold** next to each bullet point


* Frontend: **N/A**
    * Will not be required as our project is just an API for other apps
* Backend: **Node.js**
    * _Option 1:_ Node.js
        * Every team member has prior experience
        * Easy integration with MongoDB
    * _Option 2:_ Flask
        * Used only by James in the past
        * Unfamiliar with DB integrations, possible risk
* Database: **MongoDB**
    * _Context:_ We will only need to save ActivityDefinitions and PlanDefinitions into a database
        * `id` properties aren’t unique across both activity and plan definitions, so we will create separate DB schemas for each
        * Our database will only store JSON objects, so it’s not necesary to use a relational database
    * _Option 1:_ MongoDB
        * Free to use
        * Mongoose allows easy integration with Node.js
        * Team has familiarity working with mongo in the past
        * Easily define schemas for backend use
* Hosting service: **Heroku**
    * _Option 1:_ Firebase
        * Free to use
        * Has its own DB and authentication
        * Limited flexibility, forces the use of a proprietary DB (no mongo allowed)
    * _Option 2:_ Heroku 
        * Free to use
        * Prior experience for team members who took CSC309
        * Compared to Firebase, Heroku is more flexible and easier to integrate with other services
* Container service: **Docker**
    * _Option 1:_ Vagrant
        * Can run in non-linux environments because it functions as a VM
    * _Option 2:_ Docker
        * Team has prior experience with Docker
        * Requires less resources and setup since we only need to load libraries
        * App will be run in a linux environment, so we’re choosing docker because there's less risk with unfamiliarity
* Testing: **Jest**
    * _Option 1:_ Jest
        * Self contained 
        * Most simple to use
    * _Option 2:_ Mocha 
        * Does not have its own assertion libraries, involves more dependencies
            * Chai is required for assertion
            * Sinon is used for spies/stubs
    * _Option 3:_ Jasmine 
        * Unable to run tests without a third party
    * Decided to go with Jest because the scope of the project isn’t large enough to justify the more heavyweight options

---

## Meeting Notes

Meeting notes can be found in the `meeting-notes` folder in the top level directory of the repo.