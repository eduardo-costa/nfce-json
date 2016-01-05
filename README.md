# nfce-json
Client for downloading Brazilian NFCe data in Json format.

# Install

`npm install nfce-json`

# Usage  
  
```js
var NFCE 		= require("nfce.js").NFCE;
var NFCEParser  = require("nfce-rs.js").NFCEParser; //nfce-xx where 'xx' is the UF of Brazil

NFCE.init(NFCEParser);
NFCE.load("nfce-code-here",
function(p_res,p_err)
{
	var json = JSON.stringify(p_res,null," ");
	var fs = require("fs");
	fs.writeFileSync("output.json",json);
	console.log(p_res);
});
```