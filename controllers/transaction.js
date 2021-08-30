const TronWebClass = require('./TronWeb');
const config = require('../config/config');
const helper = require('../utils/helper');
const winston = require('../config/winston');

//Function Handler for transferring tokens
const transferToken = async(req,res,next) => {

  winston.info("************************************************************")
  //Fetching parameters from body
  const address = req.body.address;
  const amount = parseInt(req.body.amount);

  winston.info("Address: "+address+" Amount: "+amount);

  if(isNaN(amount) || address.length==0){
    winston.error("Invalid Paramerter");
    res.status(400).json({
      "success":false,
      "error":"Invalid parameters"
    })
  }

  try{

    //Tron Address Verifications
    const tronWeb = new TronWebClass.TronWeb();
    let accountStatus=await tronWeb.verifyToAddress(address);
    winston.info("Account Status : "+ accountStatus);
    if(accountStatus!== true){
      res.status(400).json(accountStatus);
    }


    //Fetching contract Details
    let transferContract = await tronWeb.getContract()
                           .catch(error =>{
                             winston.error("Invalid contract Address - "+ error);
                             next(new Error("Invalid contract Address"));
                           });

    //Winston Logging
    winston.info("Transfer Contract : "+ transferContract);

    let contractTokenBalance = await transferContract.getTokenBalance(config.contractAddress,config.tokenId).call()
                              .catch(error =>{
                                winston.error("Cannot fetch contract token Balance");
                                next(new Error("Cannot fetch contract token Balance"));
                              });


    contractTokenBalance = tronWeb.bigNumberToDecimal(contractTokenBalance);

    winston.info("Contract Token Balance : "+ contractTokenBalance);

    let flag = true;
    //Transfering amount from contract
    if(contractTokenBalance > amount){
      flag = false;
      let args = {
              callValue:0,
              shouldPollResponse: true
          };

      const txHash = await transferContract.transferToken(address,parseInt(amount),config.tokenId).send().
                  catch(error => {
                    winston.error("Token transfer failed from contract");
                    next (new Error("Token transfer failed from contract"));
                  });

      winston.info("Token transferred: "+ txHash);
      res.status(200).json({
        'success' : true,
        'result':{
          'txHash' : txHash,
          'mode'   : 'CONTRACT'
        }
      });

    }else{



      //Fetching client address balance
      let clientTokenBalance = await transferContract.getTokenBalance(config.clientAddress,config.tokenId).call()
                                .catch(error =>{
                                  winston.error("Cannot fetch client token Balance");
                                  next(new Error("Cannot fetch client token Balance"));
                                });
      clientTokenBalance= tronWeb.bigNumberToDecimal(clientTokenBalance);

      winston.info("Client Token Balance : "+ clientTokenBalance);

      if(clientTokenBalance > amount){
        flag = false;

        let args = {
                callValue:0,
                shouldPollResponse: true
            };

        // Transferring tokens from client address to winner
        const txHash = await tronWeb.sendTokenFromClient(address,amount)
                      .catch(error => {
                        winston.error("Token Transfer failed from Client Address");
                        next(new Error("Token Transfer failed from Client Address"));
                      });

        winston.info("Token transferred from client: "+ JSON.stringify(txHash));
        res.status(200).json({
          'success' : true,
          'result':{
            'txHash' : txHash.transaction.txID,
            'mode'   : 'CLIENT'
          }
        });
      }
    }


    // Response if both accounts contain insufficient funds
    if(flag){
      winston.error("Insufficient Funds");
      res.status(200).json({
        'success' :false,
        'error'  :"Insufficient funds"
      });
    }

  }catch(err){
    winston.error("Error: "+err);
    const error = new Error("Unexpected Error");
    error.statusCode = 500;
    next(error);
  }

}



//Function for fetching transaction details
const transactionInfo = async(req,res,next) => {

  winston.info("************************************************************");
  const txId = req.params.txId.trim();

  if(txId.length ==0 || txId==null || !helper.isValidHex(txId)){
    winston.error("Invalid Parameter: "+ txId);
    res.status(400).json({
      'success': false,
      'error': 'Invalid Parameter'
    })
  }

  try{

    //New tronWeb object
    const tronWeb = new TronWebClass.TronWeb();

    //Fetching Transaction Details
    const txDetails =  tronWeb.getTransactionDetails(txId)
                       .then(
                          result => {
                              winston.info("Transaction : "+ " "+ result.txID);
                              res.status(200).json({
                                'success': true,
                                'result' : result
                           })
                          },
                          error => {
                            winston.error("Transaction not found");
                            res.status(404).json({
                              'success': false,
                              'error'  : "Transaction not found"
                            })
                          }
                     ).catch(error =>{
                       winston.error(error);
                       throw error;
                     });

  }catch{

    const error = new Error("Error fetching transaction details");
    error.statusCode = 500;
    winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next(error);
  }


}


//Function Handler for Invalid route call
const invalidCall = async(req,res,next)=>{
  winston.info(`${req.originalUrl} - ${req.method} - ${req.ip}`+" Invalid API Call ");
  res.status(404).json({
    'success':false,
    "error": "Invalid API call"
  });
}

module.exports = {
  transferToken: transferToken,
  transactionInfo : transactionInfo,
  invalidCall: invalidCall
}
