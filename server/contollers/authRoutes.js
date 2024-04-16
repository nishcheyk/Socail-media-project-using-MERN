const express = require("express");
const router = express.Router();
const UserModel = require('./models/Employee');

router.post("/login", (req, res) => {

        const { email, password } = req.body;
        UserModel.findOne({ email: email })
            .then(user => {
                if (!user) {
                    res.status(401).json({ success: false, message: "No record existed for this email address." }); // Change marked here
                } else {
                    if (user.password === password) {
                        res.status(200).json({ success: true, message: "Login successful", user: user }); // Change marked here
                    } else {
                        res.status(401).json({ success: false, message: "Incorrect password." });
                    }
                }
            })
            .catch(err => {
                console.error("Error during login:", err);
                res.status(500).json({ success: false, message: "Internal server error" }); // Change marked here
         
    });
});

router.post("/register", (req, res) => {
    // Registration route implementation
});

router.post("/forgetPassword", (req, res) => {
    // Forgot password route implementation
});

module.exports = router;
