// ------------------------ IMPORTING MODULES and SETTING UP ENV ------------------------- // 

// Load Express
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

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

// Start user session
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

// Import review object driver. 
const reviewCtrl = require("./controllers/reviews");

// Import authoriuzation/user object driver.
const authCtrl = require("./controllers/auth");
app.use("/auth", authCtrl);

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
// GET Methods

// GET: Show all reviews
app.get('/reviews', reviewCtrl.index);

// GET: Show all reviews by game
app.get('/home/:gameid', reviewCtrl.index);

// GET: Show all reviews by user
app.get('/reviews/:user', reviewCtrl.indexByUser);

// GET: Display review 
app.get("/reviews/new", reviewCtrl.new);

// Show specific review
app.get("/reviews/:reviewID", reviewCtrl.show);

// Show and EDIT review
app.get("/reviews/:reviewID/edit", reviewCtrl.edit);

// POST Method - add review 
app.post("/reviews/new", reviewCtrl.create);

// PUT Method - update review
app.put("/reviews/:reviewID", reviewCtrl.update);

// DELETE Method - delete review
app.delete("/reviews/:reviewID", reviewCtrl.delete);

// Listener
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});