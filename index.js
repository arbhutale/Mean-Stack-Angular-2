const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');


mongoose.Promise = global.Promise;
mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('cannot connected to database')
    }else{
        //console.log(config.secret);
        console.log('Connected to Database: ' + config.db);
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/'));

app.use('/authentication',authentication);


app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080,() => {
    console.log('Listiening on port 8080');
});