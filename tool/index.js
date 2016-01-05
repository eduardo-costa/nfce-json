module.exports = 
{
  NFCE: require('./nfce.js').NFCE,
};

//Init the parser object
module.exports.NFCE.parser = {};

module.exports.NFCE.parser["rs"] = require("./nfce-rs.js").NFCEParser; //Parser for the RS state
//module.exports.NFCE.parser["rj"] = require("./nfce-rj.js").NFCEParser; //[TBD] Parser for the RJ state 
//module.exports.NFCE.parser["df"] = require("./nfce-df.js").NFCEParser; //[TBD] Parser for the DF state 
