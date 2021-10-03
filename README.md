# CSC302Project3
Description: A library for existing digital medical guidelines in FHIR format that allows other apps to retrieve them

---

## Repo Layout

```
api/
    routes/
    services/
    tests/
meeting-notes/
documents/
models/
scripts/
```

* Entry point > `app.js` located in the top level directory
* Backend > `api/` folder containing routes, services and tests for the API
* Data > `models/` folder containing mongoose database schemas for our library
* Execution > `scripts/` folder with scripts for running and testing the app

---

# Where to find our documentation and meeting notes

## Milestones and roadmap:

Tech stack and their decisions can be found in the `Tech Stack.pdf` file under the `documents` folder in the top level directory of the repo.

---

## Project development plan:

The project development plan can be found in the `Milestones.pdf` file under the `documents` folder in the top level directory of the repo.

---

## Meeting Notes

Meeting notes can be found in the `meeting-notes` folder in the top level directory of the repo.

---

# How do we <build/run/test> our project in one click?

## Docker

### Pre-requisite
This project uses `Docker` and `docker-compose` to containerize and deploy the application. Please ensure you have `docker`, `docker-compose`, and `docker-engine` installed on your machine. If not, follow the steps in the following links: https://docs.docker.com/engine/install/ and https://docs.docker.com/compose/install/

Also please ensure that the docker service is running. If it is not running, you can launch it on Linux machines with the command `sudo systemctl start docker`. If you are not running Linux, please search online for further instructions.

### Building and Running

Once docker is running, simply build and run the project:

    docker-compose up -d e_dev

This will automatically build an image if one does not exist, and then run the application. If you see errors about permissions, try running `sudo docker-compose up -d e_dev`

The `-d` command will run the application in the background as a daemon.

If you want to force a build, add the `--build` argument. If you want to build without running, use the command `docker-compose build`

### Targets

The docker-compose configuration contains seperate targets for test, development/staging, and production builds. To run one of these builds, simply use the commands:

    docker-compose up [commands] <target>

Here are is the list of all currently available targets:

+ `e_test` -- Test build for express.js server.
+ `e_dev`  -- Development build for express.js server.
+ `e_prod` -- Production build for express.js server.

### Troubleshooting

- If you get the following error while deploying: `Error while fetching server API version` then your issue might be permission issues with docker's socket. Run the (Linux) command `sudo chmod 666 /var/run/docker.sock`, which may solve the issue.

---

## Available Scripts

In the project directory, you can run the following commands to install/run/test our project using npm.

### `npm install`

Installs all dependencies required for the project to run.

### `npm start`

Runs the project on the local machine.

### `npm test`

Runs the test suites of the project.

Alternatively, use Docker to install/run/test our project in one click.

---
