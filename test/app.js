
var NFCE 		= require("../tool/nfce.js").NFCE;
var NFCEParser  = require("../tool/nfce-rs.js").NFCEParser;

NFCE.init(NFCEParser);
NFCE.load("43151293015006000890651050000132661681112959",
function(p_res,p_err)
{
	var json = JSON.stringify(p_res,null," ");
	var fs = require("fs");
	fs.writeFileSync("output.json",json);
	console.log(p_res);
});