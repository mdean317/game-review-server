const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
module.exports = router;

router.post("/sign-up", async (req, res) => {
    
    console.log(req.body);
    const isUserInDatabase = await User.findOne({ accountName: req.body.accountName });
    if (isUserInDatabase) {
        return res.send("Account name is already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    req.session.user = {
        accountName: user.accountName,
      };
      
      req.session.save(() => {
        res.json(user);
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
        res.json(userInDatabase);
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
   
    res.json(userInDatabase);

});

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.json();
      });
});