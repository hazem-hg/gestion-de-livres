const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
var passport = require('passport');
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://mongodb1:27017/test1',{useNewUrlParser : true});
var db = Mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',function(){
    console.log('CONNECTED');
})
const app = express();
app.listen(8081, ()=>{
    console.log('Authentitcation microservice is listening to port 8081')
});
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use(passport.initialize())
require('./config/passport')(passport)


const usersRoute = require('./routes/user');
const user = require('./models/User');
app.use('/',usersRoute);

app.get('/confirm/:token',(req,res)=>{
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify("Account verified"));
    user.findOne({
        remember_token : req.params.token,
    }).then((fUser)=>{
        if(!fUser){
            res.json({body :'User Not found'});
        }
        fUser.status = 1;
        fUser.remember_token = null;
        fUser.save();
    })
})

/*app.use("/htmlPage",express.static('public'));

app.get("/", (req,res)=>{
    res.send("hello world");
})*/
