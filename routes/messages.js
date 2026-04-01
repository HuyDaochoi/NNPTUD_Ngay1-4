var express = require('express');
var router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.createMessage);

router.get('/:userID', messageController.getChatHistory);

router.get('/', messageController.getLastMessages);

module.exports = router;