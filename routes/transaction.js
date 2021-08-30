const express = require('express');

//Creating router
const router = express.Router();

//Controller file (Business Logic)
const transactionController = require('../controllers/transaction')

//Post Endpoint for transfering tokens
router.post('/transfer',transactionController.transferToken)

//Get Endpoint for transaction details
router.get('/transaction/:txId',transactionController.transactionInfo)

//Invalid Endpoint
router.get('*',transactionController.invalidCall);
router.post('*',transactionController.invalidCall);

//Exporting modules
module.exports = router;
