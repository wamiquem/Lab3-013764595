var express = require('express');
var router = express.Router();
const queries = require('../queries');
const encrypt = require('../encrypt');
const path = require('path');
const {secret} = require('../config/config');
var passport = require("passport");
var jwt = require("jsonwebtoken");

router.post('/signup',function(req,res){
    console.log("Inside Owner signup Post Request");
    console.log("Req Body : ",req.body);
    const owner = req.body;

    encrypt.generateHash(owner.password, hash => {
        queries.createOwner(owner, hash, result => {
            console.log("Owner created with id: " + result._id);
            res.status(200).send({success: true, id: result._id, message:'Owner created'});
        }, err => {
            if(err.code === 11000){
                res.status(401).send({success: false, message: `Email already exists. Plz sign up with a different email id. ${err.message}` });
            }else{
                res.status(500).send({success: false, message: `Something failed when inserting record. ${err.message}`});
            }
        });
    }, err => {
        res.status(500).send({success: false, message: 'Something failed when gnerating hash' });
    });
});

router.post('/login',function(req,res){
    console.log("Inside Owner Login Post Request");
    console.log("Req Body : ",req.body);

    const email = req.body.email;
    const password = req.body.password;

    queries.getOwnerPasswordByEmail(email, row => {
        if(row){
            encrypt.confirmPassword(password,row.password, result => {
                if (result){
                    // res.cookie('cookie',{id: row.id},{maxAge: 3600000, httpOnly: false, path : '/'});
                    let user = {
                        email: email,
                        id: row.id,
                        userType: 'buyer'
                    }
                    var token = jwt.sign(user, secret, {
                        expiresIn: 10080 // in seconds
                    });
                    res.status(200).json({success: true, message: "Owner Login successful", id: row.id, firstName: row.fname, token: token});
                }else{
                    res.status(401).json({success: false, message: "Incorrect Password. Please try again"});
                }
            }, err => {
                res.status(500).json({success: false, message: "Something wrong with bcrypt"});
            });
        }else{
            res.status(401).json({success: false, message: "Email does not exists. Please try again"});
        }
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading the record. ${err}`});
    });
});

router.post('/updateName',function(req,res){
    console.log("Inside Update Name Post Request");
    console.log("Req Body : ",req.body);
    const owner = req.body;
    
    queries.getOwnerPasswordById(owner.id, row => {
        encrypt.confirmPassword(owner.password,row.password, result => {
            if (result){
                queries.updateOwnerName(owner, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Owner name updated successfully.'});    
                }, err => {
                    res.status(500).json(`Something wrong when updating owner name. ${err}`);
                })
            }else{
                res.status(401).json('Incorrect Password. Please try again');
            }
        }, err => {
            res.status(500).json(`Something wrong with bcrypt compare. ${err.message}`);
        });     
    },err => {
        res.status(500).json(`Something wrong when reading password by id. ${err.message}`);
    });
});

router.post('/updateEmail',function(req,res){
    console.log("Inside Update Email Post Request");
    console.log("Req Body : ",req.body);
    const owner = req.body;
    
    queries.getOwnerPasswordById(owner.id, row => {
        encrypt.confirmPassword(owner.password,row.password, result => {
            if (result){
                queries.updateOwnerEmail(owner, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Owner email updated succesfully.'});    
                }, err => {
                    res.status(500).json(`Something wrong when updating buyer email. ${err}`);
                })
            }else{
                res.status(401).json('Incorrect Password. Please try again');
            }
        }, err => {
            res.status(500).json(`Something wrong with bcrypt compare. ${err.message}`);
        });     
    },err => {
        res.status(500).json(`Something wrong when reading password by id. ${err.message}`);
    });
});

router.post('/updatePassword',function(req,res){
    console.log("Inside Update Password Post Request");
    console.log("Req Body : ",req.body);
    const owner = req.body;
    
    queries.getOwnerPasswordById(owner.id, row => {
        encrypt.confirmPassword(owner.oldPassword,row.password, result => {
            if (result){
                encrypt.generateHash(owner.newPassword, hash => {
                    queries.updateOwnerPassword({id: owner.id, password: hash}, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Owner password updated succesfully.'});    
                }, err => {
                    res.status(500).json(`Something wrong when updating owner password. ${err}`);
                })
                }, err => {
                    res.status(500).json(`Something wrong while bcrypt hashing. ${err}`);
                });    
            }else{
                res.status(401).json('Incorrect Old Password. Please try again');
            }
        }, err => {
            res.status(500).json(`Something wrong with bcrypt compare. ${err.message}`);
        });     
    },err => {
        res.status(500).json(`Something wrong when reading password by id. ${err.message}`);
    });
});

router.get('/firstName',function(req,res){
    console.log("Inside Owner First Name Get Request");
    console.log("Req Query : ",req.body);

    queries.getOwnerFirstNameById(req.query.id, owner => {
        res.status(200).json({success: true, firstName: owner.fname});
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading buyer first name. ${err}`});
    })
});

router.post('/updateProfile',function(req,res){
    console.log("Inside Owner Update Profile Post Request");
    console.log("Req Query : ",req.query);

    queries.updateOwnerProfile(req.query.id, req.body, doc => {
        console.log("Owner profile updated succesfully");
        res.status(200).send({message:'Owner profile updated succesfully.'});    
    }, err => {
        res.status(500).json(`Something wrong when updating owner profile. ${err}`);
    });
});

router.get('/details',function(req,res){
    console.log("Inside Owner Details Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getOwnerDetailsById(req.query.id, owner => {
        res.status(200).json({success: true, owner:owner});
    }, err => {
        res.status(200).json({success: false, message: `Something wrong when reading buyer first name. ${err}`});
    })
});

router.get('/profilePic',function(req,res){
    console.log("Inside Owner profile pic Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getOwnerImageNameById(req.query.ownerId, owner => {
        res.sendFile(path.join(__dirname, `../uploads/${owner.image}`));
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading owner image. ${err}`});
    })
});

router.post('/addRestaurant',function(req,res){
    console.log("Inside add Restaurant Post Request");
    console.log("Req Body : ",req.body);
    const restaurant = req.body;

    queries.createRestaurant(restaurant, result => {
        console.log("Number of records inserted: " + result.affectedRows);
        res.status(200).send({success: true, message:'Restaurant added successfully'});
    }, err => {
        res.status(500).send({success: false, message: `Something failed when inserting record. ${err.message}`});
    });
});

module.exports = router;