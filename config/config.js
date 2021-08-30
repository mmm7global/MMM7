let ABI = {"entrys":[{"outputs":[{"type":"address"}],"constant":true,"name":"admin","stateMutability":"View","type":"Function"},{"stateMutability":"Nonpayable","type":"Constructor"},{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"address"}],"payable":true,"name":"betAmount","stateMutability":"Payable","type":"Function"},{"inputs":[{"name":"toAddress","type":"address"},{"name":"tokenvalue","type":"uint256"},{"name":"id","type":"trcToken"}],"name":"transferToken","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"getAdminAddress","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"accountAddress","type":"address"}],"name":"getTokenBalance","stateMutability":"View","type":"Function"}]};

let config = {
  hostname: 'localhost',
  port: 3000,
  fullNode : 'https://api.trongrid.io', //https://api.trongrid.io
  solidityNode : 'https://api.trongrid.io', //https://api.trongrid.io
  eventServer : 'https://api.trongrid.io', //https://api.trongrid.io
  setAddress : '', // Contract admin address
  contractAddress : '', //Deployed contract address
  privateKey : '', //Private key of client address
  IssuerAddress: "TYDX8AEyyfutqX2vMbd351HqirYkwq4Sht", //Client address where tokens are stored
  tokenId:"1003438", //Id of the token stored in contract or client address
  contractAbi: ABI.entrys
};

module.exports = config;
