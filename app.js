const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

const { ActivityDefinition } = require('./models/activity-definition');
const { PlanDefinition } = require('./models/plan-definition');

var events = require('events');

const VALID_RESOURCE_TYPES = ['ActivityDefinition', 'PlanDefinition']
const validateResourceTypeAndId = (req, res, next) => {
  const { resourceType, id } = req.params;
  errors = [];

  if (!id) {
    errors.push("Missing id in request");
  }

  if (!resourceType) {
    errors.push("Missing resourceType in request");
  } else if (!VALID_RESOURCE_TYPES.includes(resourceType)) {
    errors.push(`Invalid resourceType: ${resourceType}`);
  }

  if (errors.length) {
    res.status(400).send({ errors });
  } else {
    next();
  }
}

function load_db() {
  // todo: replace with remote db uri
  mongoose.connect('mongodb://127.0.0.1:27017/test');

  // const activitySchema = new mongoose.Schema({ id: 'string' });
  // activityModel = mongoose.model('Activity', activitySchema);

  // const planSchema = new mongoose.Schema({ id: 'string' });
  // planModel = mongoose.model('Plan', planSchema);
}

load_db();

app.get('/listDefinitions', (req, res) => {
  let resourceType = req.query.resourceType;
  let model = null;

  if (resourceType === "ActivityDefinition") {
    model = ActivityDefinition;
  } else if (resourceType === "PlanDefinition") {
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

  if (resourceType === "ActivityDefinition") {
    model = ActivityDefinition;
  } else if (resourceType === "PlanDefinition") {
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

module.exports.close = close;
module.exports.app_server = app_server
