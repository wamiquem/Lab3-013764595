var express = require('express');
var router = express.Router();
const queries = require('../queries');
const encrypt = require('../encrypt');
const path = require('path');
const {secret} = require('../config/config');
var passport = require("passport");
var jwt = require("jsonwebtoken");

router.post('/signup',function(req,res){
    console.log("Inside Buyer signup Post Request");
    console.log("Req Body : ",req.body);
    const buyer = req.body;

    encrypt.generateHash(buyer.password, hash => {
        queries.createBuyer(buyer,hash, result => {
            console.log("Buyer created with id: " + result._id);
            res.status(200).send({success: true, message:'Buyer created'});
        }, err => {
            if(err.code === 11000){
                res.status(401).send({ success: false, message: 'Email already exists. Plz sign up with a different email id' });
            }else{
                res.status(500).send({ success: false, message: `Something failed when inserting record. ${err}`});
            }
        });
    }, err => {
        res.status(500).send({ success: false, error: 'Something failed when gnerating hash' });
    });
});

router.post('/login',function(req,res){
    console.log("Inside Buyer Login Post Request");
    console.log("Req Body : ",req.body);

    const email = req.body.email;
    const password = req.body.password;

    queries.getBuyerPasswordByEmail(email, row => {
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
                    res.status(200).json({success: true, message: "Buyer Login successful", id: row.id, firstName: row.fname, token: token});
                    console.log("Response Status", res.statusCode);
                }else{
                    res.status(401).json({success: false, message: "Incorrect Password"});
                    console.log("Response Status", res.statusCode);
                }
            }, err => {
                res.status(500).json({success: false, message: "Something wrong with bcrypt"});
            });
        }else{
            res.status(401).json({success: false, message: "Email does not exists. Please try again"});
            console.log("Response Status", res.statusCode);
        }
    }, err => {
        res.status(500).json({success: false, message: "Something wrong when reading the record"});
    });
});

router.post('/updateName',function(req,res){
    console.log("Inside Update Name Post Request");
    console.log("Req Body : ",req.body);

    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const password = req.body.password;
    const buyerId = req.body.buyerId;
    
    queries.getBuyerPasswordById(buyerId, row => {
        encrypt.confirmPassword(password,row.password, result => {
            if (result){
                queries.updateBuyerName({id: buyerId, fname: fname, lname: lname}, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Buyer name updated successfully.'});    
                }, err => {
                    res.status(500).json(`Something wrong when updating buyer name. ${err}`);
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

    const email = req.body.email;
    const password = req.body.password;
    const buyerId = req.body.buyerId;
    
    queries.getBuyerPasswordById(buyerId, row => {
        encrypt.confirmPassword(password,row.password, result => {
            if (result){
                queries.updateBuyerEmail({id: buyerId, email: email}, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Buyer email updated succesfully.'});    
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

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const buyerId = req.body.buyerId;
    
    queries.getBuyerPasswordById(buyerId, row => {
        encrypt.confirmPassword(oldPassword,row.password, result => {
            if (result){
                encrypt.generateHash(newPassword, hash => {
                    queries.updateBuyerPassword({id: buyerId, password: hash}, sqlresult => {
                    console.log("Number of records updated: " + sqlresult.affectedRows);
                    res.status(200).send({message:'Buyer password updated succesfully.'});    
                }, err => {
                    res.status(500).json(`Something wrong when updating buyer password. ${err}`);
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

router.post('/updateAddress',function(req,res){
    console.log("Inside Buyer Update Password Post Request");
    console.log("Req Query : ",req.query);

    queries.updateBuyerAddress(req.query.id, req.body, sqlresult => {
        console.log("Buyer address and phone updated succesfully");
        res.status(200).send({message:'Buyer address and phone updated succesfully.'});    
    }, err => {
        res.status(500).send({message:`Something wrong when updating buyer address. ${err}`}); 
    });
});

router.post('/updateProfile',function(req,res){
    console.log("Inside Buyer Update Profile Post Request");
    console.log("Req Query : ",req.query);

    queries.updateBuyerProfile(req.query.id, req.body, doc => {
        console.log("Buyer profile updated succesfully");
        res.status(200).send({message:'Buyer profile updated succesfully.'});    
    }, err => {
        res.status(500).json(`Something wrong when updating buyer profile. ${err}`);
    });
});

router.get('/firstName',function(req,res){
    console.log("Inside buyer First Name Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getBuyerFirstNameById(req.query.id, buyer => {
        res.status(200).json({success: true, firstName: buyer.fname});
        console.log("Response Status", res.statusCode);
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading buyer first name. ${err}`});
    })
});

router.get('/address',function(req,res){
    console.log("Inside buyer Address Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getBuyerAddressById(req.query.id, buyerAddress => {
        res.status(200).json({success: true, buyerAddress: buyerAddress});
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading buyer first name. ${err}`});
    })
});

router.get('/details',function(req,res){
    console.log("Inside buyer Details Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getBuyerDetailsById(req.query.id, buyer => {
        res.status(200).json({success: true, buyer: buyer});
    }, err => {
        res.status(200).json({success: false, message: `Something wrong when getting buyer details. ${err}`});
    })
});

router.get('/profilePic',function(req,res){
    console.log("Inside buyer profile pic Get Request");
    console.log("Req Query : ",req.query);
 
    queries.getBuyerImageNameById(req.query.id, buyer => {
        res.sendFile(path.join(__dirname, `../uploads/${buyer.image}`));
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading buyer image. ${err}`});
    })
});

router.get('/searchRestaurants',passport.authenticate("jwt", { session: false }),function(req,res){
    console.log("Inside buyer search restaurants pic Get Request");
    console.log("Request Query : ",req.query);

    const name = (req.query.menuItem) ? req.query.menuItem : "";
    queries.getAllMatchingRestaurants(name, row => {
        console.log("Records",row);
        res.status(200).json({success: true, row});
    }, err => {
        res.status(500).json({success: false, message: `Something wrong while getting restaurants ${err}`});
    })
});

router.get('/filterRestaurants',function(req,res){
    const cuisine = "chinese";
    queries.getRestaurantsByCuisine(cuisine, row => {
        console.log("row",row);

        res.status(200).json({success1: true, row});
    }, err => {
        res.status(500).json({success: false, message: `Something wrong while filtering all restaurants ${err}`});
    })
});

router.post('/placeOrder',function(req,res){
    console.log("Inside Buyer Place Order Post Request");
    console.log("Req Body : ",req.body);
    
    const order = req.body;
    queries.createOrder(order, message => {
        res.status(200).send({success: true, message:message});
    }, err => {
        res.status(500).send({ message: `Something failed when creating order. ${err.message}`});
    });
});

router.get('/upcomingOrders',function(req,res){
    console.log("Inside Buyer Upcoming Orders Get Request");
    console.log("Req Query : ",req.query);
    
    queries.getUpcomingOrdersbyBuyerId(req.query.id, orders => {
        res.status(200).json({success: true, orders: orders});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting order details from the table. ${err.message}`});
    });
});

router.get('/pastOrders',function(req,res){
    console.log("Inside Buyer Past Orders Get Request");
    console.log("Req Query : ",req.query);
    
    queries.getPastOrdersbyBuyerId(req.query.id, orders => {
        res.status(200).json({success: true, orders: orders});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting order details from the table. ${err.message}`});
    });
});

router.get('/restaurantImage/:restaurantId',function(req,res){
    console.log("Inside restaurant profile pic Get Request");
    const restaurantId = (req.params.restaurantId) ? req.params.restaurantId : "";

    queries.getRestaurantImageNameById(restaurantId, row => {
        res.sendFile(path.join(__dirname, `../uploads/${row.image}`));
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading restaurant image. ${err}`});
    })
});

module.exports = router;