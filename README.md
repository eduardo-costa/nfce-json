# nfce-json
Loader and parser of the Brazilian NFCe data as JSON.

# Install

`npm install nfce-json`

# Usage  
  
```js
var NFCE 		= require("nfce-json").NFCE;

//Loads the desired NCFe code for the given Brazillian state.
NFCE.load("nfce-code-here","rs",
function(p_json,p_err)
{
	var json_str = JSON.stringify(p_json,null," ");
	var fs = require("fs");
	fs.writeFileSync("output.json",json_str);
	console.log(p_json);
});
```

# Caveats

 Only available for the RS state for now.