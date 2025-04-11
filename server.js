// ------------------------ IMPORTING MODULES and SETTING UP ENV ------------------------- // 

// Load Express
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

// Load .environment package, and confure env according to .env file. 
const dotenv = require("dotenv");
dotenv.config(); 

// Load package to manipulatr GET and POST into RESTful functions. 
const methodOverride = require("method-override"); 
app.use(methodOverride("_method"));

// Load package to help log HTTP requests
const morgan = require("morgan"); 
app.use(morgan("dev"));

// Set up use of user sessions
const session = require('express-session');

// ------------------------ SET UP AND CONNECT TO DB ------------------------- // 
const mongoose = require("mongoose"); 
const MongoStore = require("connect-mongo");

// Connect to DB 
mongoose.connect(process.env.MONGODB_URI);

// Log successful connection
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Start user session???
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Set up easy way to pass user between views
const passUserToView = require("./middleware/pass-user-to-view.js");
app.use(passUserToView);

// Load package to help manipulate file directory paths
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// ------------------------ SERVER LOGIC ------------------------- // 

// Import nom object driver. 
const reviewCtrl = require("./controllers/review");
const authCtrl = require("./controllers/auth");

app.use("/auth", authCtrl);

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// --------------------------- NOMINATION functions ---------------------- //

// GET Methods

//Show all reviews
app.get('/home', reviewCtrl.index);

//Show all reviews by game
app.get('/home/:gameid', reviewCtrl.index);
app.get('/', reviewCtrl.index);

// GET: Display review 
app.get("/review/new", reviewCtrl.new);
app.get("/reviews/:review", reviewCtrl.new);

// POST Method - add nom 
app.post("/reviews/new", reviewCtrl.create);

// Show and EDIT nom
app.get("/reviews/:reviewID/edit", nomCtrl.edit);

// PUT Method - update nom
app.put("/reviews/:reviewID", nomCtrl.update);

// DELETE Method - delete nom
app.delete("/reviews/:reviewID", nomCtrl.delete);

// Listener
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});