const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

var activityModel = null;
var planModel = null;

var events = require('events');

function load_db() {
    mongoose.connect('mongodb://127.0.0.1:27017/test');
    
    const activitySchema = new mongoose.Schema({ id: 'string' });
    activityModel = mongoose.model('Activity', activitySchema);

    const planSchema = new mongoose.Schema({ id: 'string' });
    planModel = mongoose.model('Plan', planSchema);
  }

load_db();

app.get('/listDefinitions', (req, res) => {
  let resourceType = req.query.resourceType;
  let model = null;

  if (resourceType === "ActivityDefinition") {
    model = activityModel;
  } else if (resourceType === "PlanDefinition") {
    model = planModel;
  } else {
    res.status(404).send({error: "Resource type invalid."});
    return;
  }

  if (model == null) {
    res.status(500).send({error: "An error occurred internally. Please try again later."});
    return;
  }

  model.distinct('id', function(err, listIds) {
    res.send({ids: listIds});
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

var app_server = app.listen(port, () => {
  console.log("I am running!");
});


function close() {
  mongoose.disconnect();
  app_server.close();
}

module.exports.close = close;
module.exports.activityModel = activityModel
module.exports.planModel = planModel
module.exports.app_server = app_server
