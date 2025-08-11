const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> res.json("hello"));

//on connect, send a hello world message
app.listen(4000, ()=> {
    console.log("listening");
});
