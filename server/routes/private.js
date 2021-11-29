/* 
    -   we create a protect some route that we don't want to access by every one
    -   if you want to user this file, you must connecting this file in the server.js
*/
const express = require('express')
const router = express.Router();
const {getPrivateData} = require('../controllers/private')
const {protect} = require('../middleware/auth')

router.get('/', protect, getPrivateData)


module.exports = router;

