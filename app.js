const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const ActivityDefinition = require('./models/activity-definition');
const PlanDefinition = require('./models/plan-definition');

var events = require('events');

function connectDb() {
  // todo: replace with remote db uri
  mongoose.connect('mongodb://127.0.0.1:27017/test');
}
connectDb();

const ACTIVITY_RESOURCE_TYPE = 'ActivityDefinition';
const PLAN_RESOURCE_TYPE = 'PlanDefinition';

const VALID_RESOURCE_TYPES = ['ActivityDefinition', 'PlanDefinition']

const validateResourceTypeAndId = (req, res, next) => {
  const { resourceType, id } = req.params;
  let error = null;

  if (!id) {
    error = "Missing id in request";
  } else if (!resourceType) {
    error = "Missing resourceType in request";
  } else if (!VALID_RESOURCE_TYPES.includes(resourceType)) {
    error = `Invalid resourceType: ${resourceType}`;
  }

  if (error) {
    res.status(400).send({ error });
  } else {
    next();
  }
}

/**
 * /listDefinitions:
 * req: query.resourceType: A string of a resourceType (see above)
 * res: A list of definitionIds of the specified resourceType
 * Status:
 * - 404: resource type invalid.
 * - 500: internal error if model can't be found.
 */
app.get('/listDefinitions', async (req, res) => {
  let resourceType = req.query.resourceType;
  let model = null;

  if (resourceType === ACTIVITY_RESOURCE_TYPE) {
    model = ActivityDefinition;
  } else if (resourceType === PLAN_RESOURCE_TYPE) {
    model = PlanDefinition;
  } else {
    res.status(404).send({ error: "Resource type invalid." });
    return;
  }

  if (model == null) {
    res.status(500).send({ error: "An error occurred internally. Please try again later." });
    return;
  }

  model.distinct('id', function (err, listIds) {
    res.send({ ids: listIds });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/:resourceType/:id', validateResourceTypeAndId, async (req, res) => {
  const { resourceType, id } = req.params;
  let model;

  if (resourceType === ACTIVITY_RESOURCE_TYPE) {
    model = ActivityDefinition;
  } else if (resourceType === PLAN_RESOURCE_TYPE) {
    model = PlanDefinition;
  }

  let record;
  try {
    record = await model.findOne({ id });
  } catch (error) {
    res.status(500).send({ error: `An error occurred internally while fetching ${resourceType} with id: ${id}` });
  }

  if (record) {
    res.send(record);
  } else {
    res.status(404).send({ error: `Could not find requested ${resourceType} with id: ${id}` });
  }
});

var app_server = app.listen(port, () => {
  console.log("I am running!");
});


function close() {
  mongoose.disconnect();
  app_server.close();
}

module.exports = {
  close,
  ActivityDefinition, PlanDefinition,
  ACTIVITY_RESOURCE_TYPE, PLAN_RESOURCE_TYPE, app_server
};
