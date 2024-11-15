const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport')
const jwtSecret = process.env.JWT_SECRET;

const signToken = ({id,name,email,avatar}) => {
    return jwt.sign({id,name,email,avatar},jwtSecret,{
        expiresIn: '1d'
    })
}

async function signup(req, res) {
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
        const alreadyExist = await User.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({ error: "Email already in use" });
        }
        console.log("hi");
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        console.log("hi2");
        return res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        return res.status(500).json({ error: "Registration failed", details: error.message });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email:email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email},
            jwtSecret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        return res.status(500).json({ error: "Login failed", details: error.message });
    }
}

async function verify(req,res){
        try {
            const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user', details: error.message });
        }
}

function Google(req,res,next) {
    passport.authenticate('google',{scope: ['profile','email']})(req,res,next);
}

function GoogleCallback(req, res, next) {
    passport.authenticate(
        'google',
        { failureRedirect: '/login' },
        (err, user) => {
            if (err) {
                console.error('Authentication Error:', err);
                return res.status(400).json({ message: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // Sign the token and send the response
            const token = signToken(user._id, user.name, user.email, user.avatar);
            res.cookie('jwt', token);
            res.redirect('http://localhost:3002/profile');
        }
    )(req, res, next);
}


module.exports = { login, signup,verify ,Google, GoogleCallback};
