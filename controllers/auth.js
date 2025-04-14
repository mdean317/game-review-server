const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
module.exports = router;

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
  
router.post("/sign-up", async (req, res) => {
    
    const isUserInDatabase = await User.findOne({ userName: req.body.userName });
    if (isUserInDatabase) {
        return res.send("Username already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    req.session.user = {
        userName: user.userName,
      };
      
      req.session.save(() => {
        res.redirect("/");
      });

});

router.post("/sign-in", async (req, res) => {

    const userInDatabase = await User.findOne({userAccount: req.body.accountName});

    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        userName: userInDatabase.userName,
        _id: userInDatabase._id
      };
    req.session.save(() => {
        res.redirect("/");
     });
});
  
router.put("/edit-username", async (req, res) => {

    const userInDatabase = await User.findOne({userAccount: req.body.accountName});

    if (!userInDatabase) {
        return res.send("User does not exist.");
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Authentication failed. Please try again.");
    }

    userInDatabase = await User.findOneAndUpdate(
        {userAccount: req.body.accountName},
        {userName: req.body.newUserName}
      );
   
 res.redirect("/");

});

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
      });
});