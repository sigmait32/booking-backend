const express = require('express');
const { registerUser } = require('../controllers/user');
const router = express.Router();

// router.get("/register", registerUser); //REGISTER 
//REGISTER 

router.get("/register", (req, res) => {
    res.json({
        message: "This is the registration route. Please use POST to register a new user."
    });
});
outer.post("/register", registerUser);

module.exports = router;