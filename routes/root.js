const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'views', 'index.html');
    res.sendFile(indexPath);
});



// Serve the login.html file for the /login.html path
router.get('^/$|/login(.html)?', (req, res) => {
    const loginPath = path.join(__dirname, '..', 'views', 'login.html');
    res.sendFile(loginPath);
});



// Serve the login.html file for the /login.html path
router.get('^/$|/create(.html)?', (req, res) => {
    const loginPath = path.join(__dirname, '..', 'views', 'login.html');
    res.sendFile(loginPath);
});
module.exports = router;

module.exports = router;