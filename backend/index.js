var express = require('express');
var app = express();
var cors = require('cors');
var passport = require("passport");
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {database, frontendURL} = require('./config/config');
var mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

var buyer = require('./routes/buyer');
var owner = require('./routes/owner');
var restaurant = require('./routes/restaurant');
var upload = require('./routes/upload');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: `${frontendURL}`, credentials: true }));
app.use(cookieParser());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${frontendURL}`);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.use(bodyParser.json());

const connectDB = async () => {
  try {
    await mongoose.connect(database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 100
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};
connectDB();

app.use(passport.initialize());
require("./config/passport")(passport);

app.use('/buyer', buyer);
app.use('/owner', owner);
app.use('/upload', upload);
app.use('/restaurant', restaurant);
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

//start your server on port 3101
app.listen(3101);
console.log("Server Listening on port 3101.");

module.exports = app;