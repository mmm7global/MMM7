const tron = require('tronweb');
const config = require('../config/config');


class TronWeb {

  constructor(){
     this.tronWeb = new tron(config.fullNode,config.solidityNode,config.eventServer,config.privateKey);
  }

  getContract(){
    return this.tronWeb.contract().at(config.contractAddress);
  }

  getTronWeb(){
    return this.tronWeb;
  }

  getTransactionDetails(txId){

    return this.tronWeb.trx.getTransaction(txId);

  }

  async verifyToAddress(address){

    let accountDetails = "";
    let errorObj ={};

    if(!this.tronWeb.isAddress(address.trim())){
      errorObj.success ="false";
      errorObj.error="Invalid Tron address"
      return errorObj;
    }

    await this.tronWeb.trx.getAccount(address.trim()).
          then(result => {
                  accountDetails = result;
                },
               error =>{
                 errorObj.success ="false";
                 errorObj.error="Cannot fetch Account details"
                 return errorObj;
                });


    if(!Object.keys(accountDetails).length){
      errorObj.success ="false";
      errorObj.error="Account not activated"
      return errorObj;
    }

    return true;
  }


  bigNumberToDecimal(number){
    return this.tronWeb.toDecimal(number);
  }

  sendTokenFromClient(address,amount){
    return this.tronWeb.trx.sendToken(address, amount,config.tokenId);
  }

}


module.exports.TronWeb = TronWeb;
