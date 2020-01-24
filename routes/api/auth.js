const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config')
const auth = require('../../middleware/auth')
const User = require('../../models/User')


// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(401).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {

        // See if user exists
        let user = await User.findOne({ email });

        if (!user) {

            // For headers already sent error include return to the statement
            return res.status(400).json({ errors: [{ msg: 'Invalid froggin details' }] });
        }


        // Match user and password

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid login details' }] });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: 3600000 },
            (err, token) => {
                if (err) console.log(err.message);
                res.json({ token })
            });


    }
    catch (err) {
        console.log(err.message);
        res.status().send('Server error');
    }
});


// @route GET api/auth
// @desc Get logged in user
// @access Private
router.get('/', auth, async (req, res) => {

    try {
        // Get user from db and leave out password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error');
    }
})


module.exports = router;