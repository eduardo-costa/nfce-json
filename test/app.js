
var NFCE 		= require("../tool/index.js").NFCE;

NFCE.load("43151293015006000890651050000132661681112959","rs",
function(p_res,p_err)
{
	var json = JSON.stringify(p_res,null," ");
	var fs = require("fs");
	fs.writeFileSync("output.json",json);
	console.log(p_res);
});