
//Helper Functions

const isValidHex = (str) => {

  let re = /[0-9A-Fa-f]{6}/g;
  if(re.test(str)){
    return true;
  }
  return false;

}


module.exports = {
  isValidHex:isValidHex,
}
