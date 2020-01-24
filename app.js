require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 3000;

async(rep, res) => {
  const AssistantV2 = require('ibm-watson/assistant/v2');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
      apikey: 'osi3yjXqwlv0XaYH69p_1T_o8I17RYeni-vADVOWhFIb',
    }),
    url: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/814cfdb8-c63b-460f-8d9f-61a5e57ebfa3',
  });

  const createSession = await assistant.createSession({
    assistantId: '6da533ac-fb4f-4f19-a658-7c76711d36c9'
  });

  let sessionId = createSession.result.session_id;

  console.log('SessionID: ');
  console.log(sessionId);
}

  app.post('/conversation/', (req, res) => {
    const { text, context = {} } = req.body;

    const params = {
      input: { text: text },
      assistantId: '6da533ac-fb4f-4f19-a658-7c76711d36c9',
      context,
      sessionId,
    }

    assistant.message(params, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json(err);
      } else {
        res.json(response);
      }
    });
  });

  app.get('/conversation/:text*?', (req, res) => {
    const { text } = req.params;
    res.json(text);
  });


app.listen(port, () => console.log(`Running on port ${port}`));
