# nfce-json
Loader and parser of the Brazilian NFCe data as JSON.

# Install

`npm install nfce-json`

# Usage  
  
```js
var NFCE 		= require("nfce-json").NFCE;

//nfce-xx where 'xx' is the UF of Brazil
var NFCEParser  = require("nfce-rs").NFCEParser; 

NFCE.init(NFCEParser);
NFCE.load("nfce-code-here",
function(p_json,p_err)
{
	var json_str = JSON.stringify(p_json,null," ");
	var fs = require("fs");
	fs.writeFileSync("output.json",json_str);
	console.log(p_json);
});
```

# Caveats

 Only available for the RS state.