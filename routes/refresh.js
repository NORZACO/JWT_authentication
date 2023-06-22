const express = require('express');
const router = express.Router();
const refreshToekenController = require('../controllers/refreshController');

router.get('/', refreshToekenController.handleRefreshToken);

module.exports = router;