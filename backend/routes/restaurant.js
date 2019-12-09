var express = require('express');
var router = express.Router();
const queries = require('../queries');
const path = require('path');

router.post('/create',function(req,res){
    console.log("Inside Create Restaurant Post Request");
    console.log("Req Body : ",req.body);
    const restaurant = req.body;

    queries.createRestaurant(restaurant, result => {
        console.log("Restaurant added with id: " + result._id);
        res.status(200).send({message:'Restaurant created'});
    }, err => {
        if(err.code === 11000){
            res.status(401).send({ message: 'A restaurant with this name already exists.' });
        }else{
            res.status(500).send({ message: `Something failed when inserting record. ${err.message}`});
        }
    });
});

router.post('/update',function(req,res){
    console.log("Inside Update Restaurant Post Request");
    console.log("Req Body : ",req.body);
    const restaurant = req.body;

    queries.updateRestaurant(restaurant, result => {
        console.log("Number of records updated: " + result.affectedRows);
        res.status(200).send({message:'Restaurant updated'});
    }, err => {
       res.status(500).send({ message: `Something failed when updating record. ${err.message}`});
        
    });
});

router.post('/addSection',function(req,res){
    console.log("Inside Restaurant Add Section Post Request");
    console.log("Req Body : ",req.body);
    const section = req.body;

    queries.addSection(section, sectionId => {
        console.log("Section added with section id: " + sectionId);
        res.status(200).send({message:'Section added', id: sectionId});
    }, err=>{
        console.log("%%%error=", err);
        if(err.code === "DUPLICATE_SECTION"){
            res.status(401).send({ success: false, message: err.message });
        }else{
            res.status(500).send({ message: `Something failed when adding section in the table. ${err.message}`});
        }
    });
});

router.get('/sections',function(req,res){
    console.log("Inside Restaurant Sections Get Request");
    console.log("Req Query : ",req.query);

    queries.getSectionsByOwnerId(req.query.ownerId, restaurant => {
        let sections = restaurant.sections.map(section => {
            return {
                _id: section._id,
                name: section.name
            }
        });
        res.status(200).json({success: true, sections: sections});
    }, err=>{
        res.status(500).send({ message: `Something failed when getting sections from the table. ${err.message}`});
    });
});

router.post('/deleteSection',function(req,res){
    console.log("Inside Restaurant Delete Section Post Request");
    console.log("Req Body : ",req.body);
    const section = req.body;

    queries.deleteSection(section, row => {
        console.log("Section deleted successfully");
        res.status(200).send({message:'Section deleted'});
    }, err => {
        res.status(500).send({ message: `Something failed when deleting section from the table. ${err.message}`});
    });
});

router.post('/updateSection',function(req,res){
    console.log("Inside Restaurant Update Section Post Request");
    console.log("Req Body : ",req.body);
    const section = req.body;

    queries.updateSection(section, result => {
        console.log("Section updated successfully");
        res.status(200).send({message:'Section updated'});
    }, err => {
        if(err.code === "DUPLICATE_SECTION"){
            res.status(401).send({ message: err.message});
        } else {
            res.status(500).send({ message: `Something failed when updating section in the table. ${err.message}`});
        }
    })
});

router.post('/addMenu',function(req,res){
    console.log("Inside Restaurant Add Menu Post Request");
    console.log("Req Body : ",req.body);
    const menu = req.body;

    queries.addMenu(menu, menuId => {
            console.log("Menu created with id: " + menuId);
            res.status(200).send({message:'Menu added', menuId: menuId});
        }, err=>{
            if(err.code === "DUPLICATE_MENU"){
                res.status(401).send({ success: false, message: err.message });
            }else{
                res.status(500).send({ message: `Something failed when adding menu in the collection. ${err.message}`});
        }
    });
});

router.get('/menus',function(req,res){
    console.log("Inside Restaurant Menus Get Request");
    console.log("Req Query : ",req.query);
    
    queries.getMenus(req.query.ownerId, restaurant => {
        res.status(200).json({success: true, sections: restaurant.sections});
    }, err=>{
        res.status(500).send({ message: `Something failed when getting menus from the collection. ${err.message}`});
    });
});

router.get('/menuItems/:restId',function(req,res){
    console.log("Inside Restaurant Menu Items Get Request");
    console.log("Req Params : ",req.params);

    let restId = req.params.restId;
    queries.getSectionsByRestaurantId(restId, restaurant => {
        res.status(200).json({success: true, sections: restaurant.sections});
    }, err=>{
        res.status(500).send({ message: `Something failed when getting menu items from the table. ${err.message}`});
    });
});

router.get('/menuImage',function(req,res){
    console.log("Inside Restaurant Menus pic Get Request");
    console.log("Req Query : ",req.query);
    
    res.sendFile(path.join(__dirname, `../uploads/${req.query.name}`));
});

router.post('/deleteMenu',function(req,res){
    console.log("Inside Restaurant Delete Menu Post Request");
    console.log("Req Body : ",req.body);
    const menu = req.body;

    queries.deleteMenu(menu, result => {
        console.log("Menu deleted successfully");
        res.status(200).send({message:'Menu deleted'});
    }, err => {
        res.status(500).send({ message: `Something failed when deleting menu from the table. ${err.message}`});
    });
});

router.post('/updateMenu',function(req,res){
    console.log("Inside Restaurant Update Menu Post Request");
    console.log("Req Body : ",req.body);
    const menu = req.body;

    queries.updateMenu(menu, result => {
        console.log("Menu updated successfully");
        res.status(200).send({message:'Menu updated'});
    }, err => {
        if(err.code === "DUPLICATE_MENU"){
            res.status(401).send({ message: 'A menu with this name already exists.' });
        } else {
            res.status(500).send({ message: `Something failed when updating menu in the collection. ${err.message}`});
        }
    })
});

router.get('/allOrders',function(req,res){
    console.log("Inside Restaurant All Orders Get Request");
    console.log("Req Query : ",req.query);
    
    queries.getAllOrders(req.query.ownerId, orders => {
        res.status(200).json({success: true, orders: orders});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting order details from the table. ${err.message}`});
    });
});

router.get('/orderedItems/:orderId',function(req,res){
    console.log("Inside Restaurant Ordered Items Get Request");
    console.log("Req Body : ",req.body);
    
    let orderId = req.params.orderId;
    queries.getMenuItemsByOrderId(orderId, row => {
        res.status(200).json({success: true, menuItems: row});
    }, err=> {
        res.status(500).send({ message: `Something failed when getting menu items from the table. ${err.message}`});
    });
});

router.post('/updateOrder',function(req,res){
    console.log("Inside Restaurant Update Order Post Request");
    console.log("Req Body : ",req.body);
    const order = req.body;

    queries.updateOrderStatus(order, message => {
        console.log("Order updated successfully");
        res.status(200).send({message: message});
    }, err => {
        res.status(500).send({ message: `Something failed when updating order status. ${err.message}`});
    })
});

router.get('/details',function(req,res){
    console.log("Inside Restaurant Details Get Request");
    console.log("Req Query : ",req.query);

    queries.getRestaurantDetailsByOwnerId(req.query.ownerId, restaurant => {
        res.status(200).json({success: true, restaurant: restaurant});
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when getting restaurant details. ${err}`});
    })
});

router.get('/profilePic',function(req,res){
    console.log("Inside restaurant profile pic Get Request");
    console.log("Req Query : ",req.query);

    queries.getRestaurantImageNameByOwnerId(req.query.ownerId, restaurant => {
        res.sendFile(path.join(__dirname, `../uploads/${restaurant.image}`));
    }, err => {
        res.status(500).json({success: false, message: `Something wrong when reading restaurant image. ${err}`});
    })
});

router.post('/updateProfile',function(req,res){
    console.log("Inside restaurant Update Profile Post Request");
    console.log("Req Query : ",req.query);

    queries.updateRestaurantProfile(req.query.ownerId, req.body, doc => {
        console.log("Restaurant profile updated succesfully");
        res.status(200).send({message:'Restaurant profile updated succesfully.'});    
    }, err => {
        res.status(500).send({ message: `Something wrong when updating restaurant profile. ${err.message}`});
    });
});

router.post('/addMessage',function(req,res){
    console.log("Inside Restaurant Add Message Post Request");
    console.log("Req Body : ",req.body);
    const message = req.body;

    queries.addMessage(message, responseMessage => {
        console.log("Message added successfully");
        res.status(200).send({message: responseMessage});
    }, err => {
        res.status(500).send({ message: `Something failed when adding message to the order. ${err.message}`});
    })
});

module.exports = router;