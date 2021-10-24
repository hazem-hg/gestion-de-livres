const express = require('express');
const router = express.Router();
var config = require('../config/dbconfig')
var jwt = require('jwt-simple')
var path = require("path");
var fs = require("fs");
const User = require('../models/User');
var nodemailer = require('nodemailer');

router.get('/users', async (req,res) =>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json({message : err});
    }
});
router.post('/add-user',async(req,res)=>{
    if((!req.body.email) || (!req.body.password)||(!req.body.username)){
        res.json({success : false , msg : 'Enter all fields'});
    }
    else{
     /* imageName = Math.random().toString(36).substr(0,10);
      fs.writeFile('./uploads/users/'+imageName+'.jpg',new Buffer(req.body.photo,"base64"),function(err){console.log(err)});*/
        const user = new User({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            remember_token : Math.random(),
            status : 0,
            rememberResettoken : null,
          //  photo : imageName+'.jpg'             
        });
        try {
            const newUser=await user.save();
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: 'ayoubabaied123@gmail.com',
                  pass: "AYOUBabaied123",
                },
                tls: {
                    rejectUnauthorized: false
                  }
              });
            var mailOptions = {
                from: 'ayoubabaied123@gmail.com',
                to: req.body.email,
                subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${req.body.username}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${user.remember_token}> Click here</a>
        `,
              };
              console.log(mailOptions);
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              
            res.json({success : true, body :newUser});
        } catch (error) {
            res.json({success : false, body :'failed to save'});
        }
    }
  
});
router.post('/reset',async (req,res)=>{
    User.findOne({email : req.body.email}).then((fUser)=>{
        if(!fUser){return res.status(404).send({message : "User Not Found"});}
        fUser.rememberResettoken=Math.random();
        fUser.save();
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: 'ayoubabaied123@gmail.com',
              pass: "AYOUBabaied123",
            },
            tls: {
                rejectUnauthorized: false
              }
          });
        var mailOptions = {
            from: 'ayoubabaied123@gmail.com',
            to: req.body.email,
            subject: "Reset your password",
html: `<h1>Reset password</h1>
    <h2>Hello ${user.fullname}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=http://localhost:8081/reset/${fUser.rememberResettoken}> Click here</a>
    `,
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    })
});
router.post('/reset/:token',(req,res)=>{
    User.findOne({rememberResettoken : req.params.token}).then((fUser)=>{
        if(!fUser){
            return res.json({message : 'User not found'});
        }
        fUser.password=req.body.password;
        fUser.rememberResettoken=null;
        fUser.save();
        res.send("password reset successfully")

    })
})

router.post('/add-admin',async(req,res)=>{
    if((!req.body.email) || (!req.body.fullname)|| (!req.body.username)|| (!req.body.tel)|| (!req.body.address)){
        res.json({success : false , msg : 'Enter all fields'});
    }
    else{
     /* imageName = Math.random().toString(36).substr(0,10);
      fs.writeFile('./uploads/users/'+imageName+'.jpg',new Buffer(req.body.photo,"base64"),function(err){console.log(err)});*/
        const user = new User({
            fullname : req.body.fullname,
            username : req.body.username,
            email : req.body.email,
            tel : req.body.tel,
            address : req.body.address,
            password : Math.random().toString(36).substr(2,9),
            remember_token : Math.random(),
            rememberResettoken : null,
            role : "admin",
            //photo : imageName+'.jpg'             
        });
        try {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: 'ayoubabaied123@gmail.com',
                  pass: "AYOUBabaied123",
                },
                tls: {
                    rejectUnauthorized: false
                  }
              });

            var mailOptions = {
                from: 'ayoubabaied123@gmail.com',
                to: req.body.email,
                subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${req.body.fullname}</h2>
        <h4>Email :  ${user.email}</h4>
        <h4>Password :  ${user.password}</h4>    
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${user.remember_token}> Click here</a>
        `,
              };
              const newUser=await user.save();
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              
            res.json({success : true, body :newUser});
        } catch (error) {
            res.json({success : false, body :'failed to save'});
        }

    }
  
});

router.post('/login',async (req,res)=>{
    User.findOne({
        email : req.body.email
    },function(err,user){
        if(err) throw err;
        if(!user){
            res.json({success : false , msg:'Authentication failed'});
        }
        else{
            user.comparePassword(req.body.password,function(err,isMatch){
                if(isMatch && !err){
                    var token = jwt.encode(user, config.secret);
                    res.json({success : true , token : token , user: user})
                }
                else{
                    return res.json({success : false,msg : 'Authentication failed'});
                }
            })
        }
    })
});

router.delete('/:userId',async(req,res)=>{
    try {
        const removedUser = await User.remove({_id : req.params.userId});
        res.json(removedUser);
    } catch (error) {
        res.json({message : error});
    }
})

router.patch('/:userId',async(req,res)=>{
    try {
        const updatedUser = await User.findOneAndUpdate({_id:req.params.userId},
            {$set : {fullname : req.body.fullname,username : req.body.username,email : req.body.email,address : req.body.address,tel:req.body.tel}});
            res.json({success : true});
    } catch (error) {
        res.json({message : error});
    }
});
router.get('/',async (req,res)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
        var token = req.headers.authorization.split(' ')[1];
        var decodedToken = jwt.decode(token , config.secret);
        return res.json({success : true,msg:'hello'+decodedToken.name});
    }
    else{
        return res.json({success : false , msg : 'No header'});
    }
});

module.exports = router;