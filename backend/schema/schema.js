const graphql = require('graphql');
const encrypt = require('../encrypt');
const queries = require('../queries');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} = graphql;

const OwnerProfileType = new GraphQLObjectType({
    name: 'OwnerProfile',
    fields: () => ({
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        phone: { type: GraphQLString },
        rest_name: { type: GraphQLString },
        rest_zip: { type: GraphQLString }
    })
});

const RestaurantProfileType = new GraphQLObjectType({
    name: 'RestaurantProfile',
    fields: () => ({
        name: { type: GraphQLString },
        phone: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zip: { type: GraphQLString },
        cuisine: { type: GraphQLString }
    })
});

const BuyerProfileType = new GraphQLObjectType({
    name: 'BuyerProfile',
    fields: () => ({
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        phone: { type: GraphQLString },
        street: { type: GraphQLString },
        unit_no: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zip_code: { type: GraphQLString },
        cuisine: { type: GraphQLString }
    })
});

const OwnerProfileResult = new GraphQLObjectType({
    name: "OwnerProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        owner: { type:  OwnerProfileType}
    })
});

const RestaurantProfileResult = new GraphQLObjectType({
    name: "RestaurantProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        restaurant: { type:  RestaurantProfileType}
    })
});

const BuyerProfileResult = new GraphQLObjectType({
    name: "BuyerProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        buyer: { type:  BuyerProfileType}
    })
});

const SectionType = new GraphQLObjectType({
    name: 'SectionType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
});

const SectionTypeResult = new GraphQLObjectType({
    name: 'SectionTypeResult',
    fields: () => ({
        sections: { type: new GraphQLList(SectionType) }
    })
});

const MenuType = new GraphQLObjectType({
    name: 'MenuType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLString },
        image: { type: GraphQLString }
    })
});

const SectionWithMenuType = new GraphQLObjectType({
    name: 'SectionWithMenuType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        menus: { type: new GraphQLList(MenuType) }

    })
});

const SectionWithMenuTypeResult = new GraphQLObjectType({
    name: 'SectionWithMenuTypeResult',
    fields: () => ({
        sections: { type: new GraphQLList(SectionWithMenuType) }
    })
});

const RestaurantType = new GraphQLObjectType({
    name: 'RestaurantType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        owner_id: { type: GraphQLID },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        street: { type: GraphQLString },
        cuisine: { type: GraphQLString }
    })
});

const RestaurantTypeResult = new GraphQLObjectType({
    name: 'RestaurantTypeResult',
    fields: () => ({
        restaurants: { type: new GraphQLList(RestaurantType) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ownerProfile: {
            type: OwnerProfileResult,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.getOwnerDetailsById(args.id, owner => {
                        result = {
                            success: true,
                            owner:{fname: owner.fname, lname: owner.lname, phone: owner.phone, 
                                rest_name: owner.rest_name, rest_zip: owner.rest_zip},
                            message: "Successful"
                        }
                        resolve(result);
                    }, err => {
                        result = {
                            success: false,
                            owner:null,
                            message: `Something wrong when reading owner first name. ${err}`
                        }
                        resolve(result);
                    })
                })
                
            }
        },restaurantProfile: {
            type: RestaurantProfileResult,
            args: { ownerId: { type: GraphQLID } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.getRestaurantDetailsByOwnerId(args.ownerId, restaurant => {
                        result = {
                            success: true,
                            restaurant:{name: restaurant.name, phone: restaurant.phone, street: restaurant.street,
                                city: restaurant.city, state: restaurant.state, zip: restaurant.zip, cuisine: restaurant.cuisine},
                            message: "Successful"
                        }
                        resolve(result);
                    }, err => {
                        result = {
                            success: false,
                            restaurant: null,
                            message: `Something wrong when getting restaurant details. ${err}`
                        }
                        resolve(result);
                    })
                })
                
            }
        }, buyerProfile: {
            type: BuyerProfileResult,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.getBuyerDetailsById(args.id, buyer => {
                        result = {
                            success: true,
                            buyer:{fname: buyer.fname, lname: buyer.lname, phone: buyer.phone, street: buyer.street, 
                                unit_no: buyer.unit_no, city: buyer.city, state: buyer.state, zip_code: buyer.zip_code},
                            message: "Successful"
                        }
                        resolve(result);
                    }, err => {
                        result = {
                            success: false,
                            buyer:null,
                            message: `Something wrong when reading buyer details. ${err}`
                        }
                        resolve(result);
                    })
                })  
            }
        }, getSections: {
            type: SectionTypeResult,
            args: { ownerId: { type: GraphQLID } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.getSectionsByOwnerId(args.ownerId, restaurant => {
                        let sections = restaurant.sections.map(section => {
                            return {
                                _id: section._id,
                                name: section.name
                            }
                        });
                        result = {sections:sections}
                        resolve(result)
                    });
                })  
            }
        }, getSectionsWithMenus: {
            type: SectionWithMenuTypeResult,
            args: { ownerId: { type: GraphQLID } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.getMenus(args.ownerId, restaurant => {
                        result = {sections:restaurant.sections};
                        resolve(result);
                    });
                })  
            }
        }, getRestaurants: {
            type: RestaurantTypeResult,
            args: { name: { type: GraphQLString } },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.getAllMatchingRestaurants(args.name, rows => {
                        let restaurants = rows.map(row => {
                            return {
                                _id: row._id,
                                name: row.name,
                                owner_id: row.owner_id,
                                city: row.city,
                                state: row.state,
                                street: row.street,
                                cuisine: row.cuisine
                            }
                        });
                        result = {restaurants:restaurants};
                        resolve(result);
                    })
                })  
            }
        }
    }
});

const OwnerSignupResult = new GraphQLObjectType({
    name: "OwnerSignupResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        id: { type:  GraphQLID}
    })
});

const AddRestaurantResult = new GraphQLObjectType({
    name: "AddRestaurantResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    })
});

const BuyerSignupResult = new GraphQLObjectType({
    name: "BuyerSignupResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    })
});

const UpdateOwnerProfileResult = new GraphQLObjectType({
    name: "UpdateOwnerProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    })
});

const UpdateRestaurantProfileResult = new GraphQLObjectType({
    name: "UpdateRestaurantProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    })
});

const UpdateBuyerProfileResult = new GraphQLObjectType({
    name: "UpdateBuyerProfileResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    })
});

const AddSectionResult = new GraphQLObjectType({
    name: "AddSectionResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        id: { type:  GraphQLID}
    })
});

const AddMenuResult = new GraphQLObjectType({
    name: "AddMenuResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        menuId: { type:  GraphQLID}
    })
});

const OwnerLoginResult = new GraphQLObjectType({
    name: "OwnerLoginResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        firstName: { type: GraphQLString },
        id: { type:  GraphQLID}
    })
});

const BuyerLoginResult = new GraphQLObjectType({
    name: "BuyerLoginResult",
    fields: () => ({
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        firstName: { type: GraphQLString },
        id: { type:  GraphQLID}
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ownerLogin: {
        type: OwnerLoginResult,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString }
        },
        resolve(parent, args){
            return new Promise((resolve, reject) => {
                let result = {};

                queries.getOwnerPasswordByEmail(args.email, row => {
                    if(row){
                        encrypt.confirmPassword(args.password,row.password, hashResult => {
                            if (hashResult){
                                result = {
                                    success: true,
                                    message: "Owner Login successful",
                                    id: row.id,
                                    firstName: row.fname
                                }
                                resolve(result);
                            }else{
                                result = {
                                    success: false,
                                    message: `Incorrect Password. Please try again`,
                                    id: null,
                                    firstName: null
                                }
                                resolve(result);
                            }
                        }, err => {
                            result = {
                                success: false,
                                message: `Something wrong with bcrypt`,
                                id: null,
                                firstName: null
                            }
                            resolve(result);
                        });
                    }else{
                        result = {
                            success: false,
                            message: `Email does not exists. Please try again`,
                            id: null,
                            firstName: null
                        }
                        resolve(result);
                    }
                }, err => {
                    result = {
                        success: false,
                        message: `Something wrong when reading the record`,
                        id: null,
                        firstName: null
                    }
                    resolve(result);
                });
            });
        }
    }, buyerLogin: {
        type: BuyerLoginResult,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString }
        },
        resolve(parent, args){
            return new Promise((resolve, reject) => {
                let result = {};
                queries.getBuyerPasswordByEmail(args.email, row => {
                    if(row){
                        encrypt.confirmPassword(args.password,row.password, hashResult => {
                            if (hashResult){
                                result = {
                                    success: true,
                                    message: "Buyer Login successful",
                                    id: row.id,
                                    firstName: row.fname
                                }
                                resolve(result);
                            }else{
                                result = {
                                    success: false,
                                    message: `Incorrect Password. Please try again`,
                                    id: null,
                                    firstName: null
                                }
                                resolve(result);
                            }
                        }, err => {
                            result = {
                                success: false,
                                message: `Something wrong with bcrypt`,
                                id: null,
                                firstName: null
                            }
                            resolve(result);
                        });
                    }else{
                        result = {
                            success: false,
                            message: `Email does not exists. Please try again`,
                            id: null,
                            firstName: null
                        }
                        resolve(result);
                    }
                }, err => {
                    result = {
                        success: false,
                        message: `Something wrong when reading the record`,
                        id: null,
                        firstName: null
                    }
                    resolve(result);
                });
            });
        }
    },ownerSignup: {
            type: OwnerSignupResult,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                fname: { type: GraphQLString },
                lname: { type: GraphQLString },
                phone: { type: GraphQLString },
                restName: { type: GraphQLString },
                restZip: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    encrypt.generateHash(args.password, hash => {
                        queries.createOwner(args, hash, owner => {
                            console.log("Owner created with id: " + owner._id);
                            result = {
                                success: true,
                                message: "Owner created",
                                id: owner._id
                            }
                            resolve(result);
                        }, err => {
                            if(err.code === 11000){
                                result = {
                                    success: false,
                                    message: `Email already exists. Plz sign up with a different email id.`,
                                    id: null
                                }
                                resolve(result);
                            }else{
                                result = {
                                    success: false,
                                    message: `Something failed when inserting record. ${err.message}`,
                                    id: null
                                }
                                resolve(result);
                            }
                        });
                    }, err => {
                        result = {
                            success: false,
                            message: `Something failed when generating hash. ${err.message}`,
                            id: null
                        }
                        resolve(result);
                    });
                });
            }
        },addRestaurant: {
            type: AddRestaurantResult,
            args: {
                ownerId: { type: GraphQLID },
                name: { type: GraphQLString },
                phone: { type: GraphQLString },
                street: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                zip: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.createRestaurant(args, restaurant => {
                        console.log("Restaurant added with id: " + restaurant._id);
                        result = {
                            success: true,
                            message: "Restaurant created"
                        }
                        resolve(result);
                    }, err => {
                        if(err.code === 11000){
                            result = {
                                success: false,
                                message: "A restaurant with this name already exists."
                            }
                            resolve(result);
                        }else{
                            result = {
                                success: false,
                                message: `Something failed when inserting record. ${err.message}`
                            }
                            resolve(result);
                        }
                    });
                })
            }
        }, buyerSignup: {
            type: BuyerSignupResult,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    encrypt.generateHash(args.password, hash => {
                        queries.createBuyer(args,hash, buyer => {
                            console.log("Buyer created with id: " + buyer._id);
                            result = {
                                success: true,
                                message: "Buyer created"
                            }
                            resolve(result);
                        }, err => {
                            if(err.code === 11000){
                                result = {
                                    success: false,
                                    message: `Email already exists. Plz sign up with a different email id.`,
                                    id: null
                                }
                                resolve(result);
                            }else{
                                result = {
                                    success: false,
                                    message: `Something failed when inserting record. ${err.message}`,
                                    id: null
                                }
                                resolve(result);
                            }
                        });
                    }, err => {
                        result = {
                            success: false,
                            message: `Something failed when generating hash. ${err.message}`,
                            id: null
                        }
                        resolve(result);
                    });
                });
            }
        }, updateOwnerProfile: {
            type: UpdateOwnerProfileResult,
            args: {
                id: { type: GraphQLID },
                fname: { type: GraphQLString },
                lname: { type: GraphQLString },
                phone: { type: GraphQLString },
                restName: { type: GraphQLString },
                restZip: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.updateOwnerProfile(args, doc => {
                        result = {
                            success: true,
                            message: `Owner profile updated succesfully.`
                        }
                        resolve(result);   
                    }, err => {
                        result = {
                            success: false,
                            message: `Something wrong when updating owner profile. ${err}`
                        }
                        resolve(result);
                    });
                });
            }
        }, updateRestaurantProfile: {
            type: UpdateRestaurantProfileResult,
            args: {
                ownerId: { type: GraphQLID },
                name: { type: GraphQLString },
                phone: { type: GraphQLString },
                street: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                zip: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};
                    queries.updateRestaurantProfile(args, doc => {
                        result = {
                            success: true,
                            message: `Restaurant profile updated succesfully.`
                        }
                        resolve(result);    
                    }, err => {
                        result = {
                            success: false,
                            message: `Something wrong when updating restaurant profile. ${err}`
                        }
                        resolve(result);
                    });
                });
            }
        }, updateBuyerProfile: {
            type: UpdateBuyerProfileResult,
            args: {
                id: { type: GraphQLID },
                fname: { type: GraphQLString },
                lname: { type: GraphQLString },
                phone: { type: GraphQLString },
                street: { type: GraphQLString },
                unit: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                zip: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.updateBuyerProfile(args, doc => {
                        result = {
                            success: true,
                            message: `Buyer profile updated succesfully.`
                        }
                        resolve(result);  
                    }, err => {
                        result = {
                            success: false,
                            message: `Something wrong when updating buyer profile. ${err}`
                        }
                        resolve(result);
                    });
                });
            }
        }, addSection: {
            type: AddSectionResult,
            args: {
                ownerId: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.addSection(args, sectionId => {
                        result = {
                            success: true,
                            message: `Section added succesfully.`,
                            id: sectionId
                        }
                        resolve(result);
                    }, err=>{
                        if(err.code === "DUPLICATE_SECTION"){
                            result = {
                                success: false,
                                message: err.message,
                                id: null
                            }
                            resolve(result); 
                        }else{
                            result = {
                                success: false,
                                message: `Something failed when adding section in the table. ${err.message}`,
                                id: null
                            }
                            resolve(result);
                        }
                    });
                });
            }
        }, addMenu: {
            type: AddMenuResult,
            args: {
                ownerId: { type: GraphQLID },
                sectionId: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise((resolve, reject) => {
                    let result = {};

                    queries.addMenu(args, menuId => {
                        console.log("Menu created with id: " + menuId);
                        result = {
                            success: true,
                            message: `Menu added succesfully.`,
                            menuId: menuId
                        }
                        resolve(result);
                    }, err=>{
                        if(err.code === "DUPLICATE_MENU"){
                            result = {
                                success: false,
                                message: err.message,
                                menuId: null
                            }
                            resolve(result); 
                        }else{
                            result = {
                                success: false,
                                message: `Something failed when adding menu in the collection. ${err.message}`,
                                menuId: null
                            }
                            resolve(result);
                    }
                });
            });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});