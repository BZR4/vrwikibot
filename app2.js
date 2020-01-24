require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 4200;

  const AssistantV1= require('ibm-watson/assistant/v1');

  var assistant = new AssistantV1({
    username: process.env.ASSISTANT_USERNAME,
    password: process.env.ASSISTANT_PASSWORD,
    version: '2018-02-16'
  });

  app.post('/conversation/', (req, res) => {
    const { text, context = {} } = req.body;

    const params = {
      input: { text: text },
      workspace_id: '6da533ac-fb4f-4f19-a658-7c76711d36c9',
      context,
    }/

    assistant.message(params, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json(err);
      } else {
        res.json(response);
      }
    });
  });


app.listen(port, () => console.log(`Running on port ${port}`));
