# Milestones:

## Milestone 1: Set up our environment, dependencies and tech stack
*To be done by: Oct 4th, 2021*

### Sub-tasks:
* A github repo is created with our team members for the project **(Assigned: Henry)**
* We have a node project that is runnable and has a simple test suite **(Assigned: Daniel)**
  * Dependencies should be ready to install in one command
  * Running the project takes only one command after dependencies are built
  * Running test suites takes only one command after dependencies are built
  * Project functionality and test coverage is not required for this milestone
* The project is containerized in Docker **(Assigned: Stew)**
* Project is hosted on Heroku, deployed with our docker image **(Assigned: James)**
* A readme is provided in top level directory of the repo with: **(Assigned: Daniel/Henry)**
  * Instructions on installing and running the project
  * A summary of our tech stack and the relevant decision making
  * Milestones of the project with member ownership of each step
  * Directions to our collection of meeting notes

## Milestone 2: Setting up DB and implementing basic functionality + unit tests
*To be done by: Nov 4th, 2021*

### Sub-tasks:
* Create db/schemas and populate our guideline definitions **(Assigned: James)**
  * Download a zip file of guidelines in json format from https://build.fhir.org/ig/HL7/cqf-recommendations/definitions.json.zip
  * Create a new database called “guidelinesdb”
  * Creates schemas
  * Create two collections for “plandefinitions” and “activitydefinitions”
  * Insert all of the plan/activity definitions from the zip file into the db
  * Verify that the db works by reading a few of the elements.
* We should be able to read a list of all guidelines and create a unit test to verify it’s functionality. **(Assigned: Henry)**
* We should be able to retrieve a specific guideline and create a unit test to verify it’s functionality. **(Assigned: Daniel)**
  * Creating different router endpoints depending on which guideline type is requested
* We should be able to add a new guideline to the db and create a unit test to verify it’s functionality. **(Assigned: Stew)**
* We should additionally verify the above functionality using manual testing with Postman **(Assigned: Henry/Daniel/Stew; everybody does their own part)**

**Note:** We have decided to assign Milestone 3 responsibilities during Milestone 2, based on our experiences with the first 2 milestones.

## Milestone 3: Additional functionality + unit tests, integration tests, documentation
*To be done by: A3 deadline*

### Sub-tasks:
* We should be able to update a guideline’s json and create a unit test to verify it’s functionality.
* We should be able to delete guidelines and create a unit test to verify it’s functionality.
* We should additionally verify the above functionality using manual testing with Postman
* Our test coverage at the end is >= 75%
* We have written integration tests to verify the following functionality:
  * adding a new guideline to DB
  * reading a list of all available guidelines
    * updating guideline’s json with a new one
  * retrieve the guideline and verify contents
  * delete the guideline.
  * Should verify both activity and plan definition.
* We have either a website or readme in our github repo which documents the following:
  * What our project is about.
  * What the various API calls do, how to use them and an example.
