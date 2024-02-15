const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup',(req,resp,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            resp.status(500).json({
                error: err
            })
        }
        else{
            const user = new User({
                _id:new mongoose.Types.ObjectId,
                username:req.body.username,
                password:hash,
                phone:req.body.phone,
                userType:req.body.userType
            })
            user.save()

            .then(result=>{
                resp.status(200).json({
                    new_user:result
                })
            })

            .catch(err=>{
                resp.status(500).json({
                    error:err
                })
            })
            
        }
    })
})

router.post('/login',(req,resp,next)=>{
    User.find({username:req.body.username})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return resp.status(401).json({
                msg:'user not exist'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return resp.status(401).json({
                    mag:'password matching fail'
                })
            }
            if(result){
                 const token = jwt.sign({
                    username:user[0].username,
                    phone:user[0].phone,
                    userType:user[0].userType
                 },
                 'this is dummy text',
                 {
                    expiresIn:"24h"
                 }
                 );
                 resp.status(200).json({
                    username:user[0].username,
                    phone:user[0].phone,
                    userType:user[0].userType,
                    token:token
                 })
            }
        })
    })
    .catch(err=>{
        resp.status(500).json({
            error:err
        })
    })
    
})

module.exports  = router;