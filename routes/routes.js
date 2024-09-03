

const express = require('express');
const router = express.Router();


console.log("api");

// Controllers
const page1 = require('../controllers/page1');
const page2 = require('../controllers/page2');
const signin = require('../controllers/signin');

// Protected routes
router.use('/signin', signin);
router.use('/page2', page2);

router.use('/page1', page1);



module.exports = router;
