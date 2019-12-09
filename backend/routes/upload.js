var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var queries = require('../queries');
// const con = require('../dbconnection');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
var upload = multer({ storage: storage }).single('image');

router.post('/buyer-profile-image', (req, res) => {
    console.log("Inside buyer profile pic post Request");

    upload(req, res, function(err){
        if(err){
            res.status(500).send({message: `Buyer Image uploaded failed due to internal issue. ${err}`});
            return;
        }
        queries.updateBuyerImage({id: req.body.id, image: req.file.filename}, doc => {
            console.log("Buyer image updated succesfully");
            res.status(200).send({message:'Buyer image updated succesfully.'});    
        }, err => {
            res.status(500).send({message: `Something wrong when updating owner image in the table. ${err}`});
        }); 
    });
});

router.post('/owner-profile-image', (req, res) => {
    console.log("Inside owner profile pic post Request");

    upload(req, res, function(err){
        if(err){
            res.status(500).send({message: `Owner Image uploaded failed due to internal issue. ${err}`});
            return;
        }
        queries.updateOwnerImage({id: req.body.id, image: req.file.filename}, doc => {
            console.log("Owner image updated succesfully");
            res.status(200).send({message:'Owner image updated succesfully.'});    
        }, err => {
            res.status(500).send({message: `Something wrong when updating owner image in the table. ${err}`});
        }); 
    });
});

router.post('/restaurant-profile-image', (req, res) => {
    upload(req, res, function(err){
        if(err){
            res.status(500).send({message: `Restaurant Image uploaded failed due to internal issue. ${err}`});
            return;
        }
        queries.updateRestaurantImageByOwnerId({ownerId: req.body.ownerId, image: req.file.filename}, doc => {
            console.log("Restaurant image updated succesfully");
            res.status(200).send({message:'Restaurant image updated succesfully.'});    
        }, err => {
            res.status(500).json(`Something wrong when updating restaurant image in the table. ${err}`);
        });
        
    });
});

router.post('/menu-image', (req, res) => {
    upload(req, res, function(err){
        if(err){
            res.status(500).send({message: `Menu Image uploaded failed due to internal issue. ${err}`});
            return;
        }
        queries.updateMenuImage({id: req.body.menuId, sectionId:req.body.sectionId, ownerId:req.body.ownerId,  image: req.file.filename}, result => {
            console.log("Menu Image updated succesfully");
            res.status(200).send({message:'Menu image updated succesfully.'});    
        }, err => {
            res.status(500).send({message: `Something wrong when updating menu image in the collection. ${err}`});
        });
    });
});

module.exports = router;