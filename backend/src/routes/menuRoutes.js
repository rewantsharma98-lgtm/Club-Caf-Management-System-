const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getPublicMenu);
router.get('/qr/:code', menuController.getMenuByTableQr);

module.exports = router;
