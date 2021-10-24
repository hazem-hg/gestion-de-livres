const express = require('express');
const booksRoute = require('./routes/Books.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://mongodb:27017/test',{useNewUrlParser : true});
var db = Mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',function(){
    console.log('CONNECTED');
})

const app = express();
app.listen(8082, ()=>{
    console.log('books microservice is listening to port 8082')
});
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use('/books',booksRoute);

/*app.use("/htmlPage",express.static('public'));

app.get("/", (req,res)=>{
    res.send("hello world");
})*/