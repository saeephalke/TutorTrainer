const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res)=> res.json("hello"));

//on connect, send a listening message
app.listen(4000, ()=> {
    console.log("listening");
});
