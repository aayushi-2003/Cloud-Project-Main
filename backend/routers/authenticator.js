const express = require("express");
const router = express.Router();
const { User } = require('../models/user');
const {signup,login,verify,GoogleCallback, Google}=require('../controllers/authController')
const auth=require('../middlewares/auth');
const passport = require('../config/passport'); // Import passport configuration


router.post("/register", signup);
router.post("/login", login);
router.get("/me",auth,verify)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    (req, res, next) => GoogleCallback(req, res, next) // Use corrected GoogleCallback
);


module.exports = router;
