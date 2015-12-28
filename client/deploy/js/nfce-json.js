/**
Class that handles the loading and parsing of NFCE information as Json.
//*/
var NFCE = 
{	
	/**
	Form URL.
	//*/
	action: "https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp",
	
	/**
	Loads a NFCE and returns its Json in the callback.
	//*/
	load: function(p_key,p_callback)
	{
		var ref = this;
		
		var d = {};
		d.HML 		= false;
		d.chaveNFCe = p_key;
		d.action 	= "Avan%E7ar";
		
		var h = {};
		h["Host"] 			= "www.sefaz.rs.gov.br";
		h["Accept"] 			= "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
		//h["Origin"]    		= "https://www.sefaz.rs.gov.br";
		//h["User-Agent"] 	= "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36";
		h["content-Type"] 	= "application/x-www-form-urlencoded";
		h["Access-Control-Allow-Origin"] = "*";
		
		ref.request(ref.action,function(res,p,xhr)
		{
			if(p>=1.0)
			{
				console.log(res);
			}
		},h,d,"POST");
	},
	
	/**
	Wrapper for a XMLHttpRequest. Accepts a callback that receives (data,progress,xhr,error).
	//*/
	request: function(p_url,p_callback,p_headers,p_data,p_method)
	{
		var method = p_method==null ? "get" : p_method;		
		var ref = this;
		var ld = new XMLHttpRequest();					
		
		ld.onprogress = function(e) 
		{
			var p = (e.total <= 0? 0 : e.loaded / (e.total + 5)) * 0.9999;
			if(p_callback!=null) p_callback(null,p,ld);
		};
		ld.upload.onprogress = 
		function(e) 
		{
			if(p_data!=null)
			{
				var p = (e.total <= 0? 0 : e.loaded / (e.total + 5)) * 0.9999;
				if(p_callback!=null) p_callback(null,-(1.0-p),ld);
			}
		};
		ld.onload = function(e1) { if(p_callback!=null) p_callback(ld.response,1.0,ld); };
		ld.onerror = function(e2){ if(p_callback!=null) p_callback(null,1.0,ld,e2); };			
		ld.open(method,p_url,true);
		
		for(var it in p_headers)
		{
			ld.setRequestHeader(it,p_headers[it]);
		}
		
		if(p_data != null)
		{				
			ld.send(p_data);
		}
		else
		{
			ld.send();
		}
		return ld;
	},
	
};

NFCE.load("43151293015006000890651040000126571160371800");