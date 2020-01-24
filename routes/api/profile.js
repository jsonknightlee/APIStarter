const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const { check, validationResult } = require("express-validator");

const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route GET /api/profile
// @desc Logged In User Profile route
// @access Private
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);


        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }


        res.json(profile)

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST /api/profile
// @desc Create or update users profile
// @access Private

router.post('/', [auth, [
    check('handle', 'Handle is required').not().isEmpty(),
    check('bio', 'Bio is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        handle,
        jobTitle,
        gender,
        dateofbirth,
        company,
        status,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        bio
    } = req.body;

    // Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (handle) profileFields.handle = handle;
    if (jobTitle) profileFields.jobTitle = jobTitle;
    if (gender) profileFields.gender = gender;
    if (dateofbirth) profileFields.dateofbirth = dateofbirth;
    if (company) profileFields.company = company;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {
        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

            return res.json(profile)
        }

        // Create Profile - If profile not found 
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status().send('Server Error');
    }
});


// @route GET /api/profile
// @desc Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {

        let profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// @route GET /api/profile/:user_id
// @desc Get profile By user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {

        let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        // differentiate from server error
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error')
    }
});

// @route Delete /api/profile
// @desc Delete profile & user
// @access Private

router.delete('/', auth, async (req, res) => {
    try {


        // remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'Profile deleted' })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})



module.exports = router;
