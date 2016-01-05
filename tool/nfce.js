/**
Class that handles the call for the NFCe webservice and parsing of the data.
//*/
var NFCE = 
{		
	/**
	Reference to the parser object.
	//*/
	parser: null,
	
	/**
	Internals.
	//*/
	req: null,
		
	/**
	Init this parser class.
	//*/
	init: function(p_parser)
	{
		this.parser = p_parser;
		if(this.req==null)		this.req = require("request");		
	},
	
	/**
	Loads the json data from a given access key
	//*/
	load:function(p_key,p_callback)
	{
		var ref = this;
		
		var p = ref.parser;
		
		if(p==null)
		{
			console.log("NFCE> Error - Parser not defined.");
			p_callback(null,new Error("Parser not defined."));
			return;
		}
		
		var fs = require("fs");
		
		p.data.chaveNFe  = p_key;
		
		ref.post(p.action,function(p_res,p_err)
		{
			if(p_err!=null) { p_callback(null,p_err); return; }			
			var o = ref.parser.parse(p_res);			
			o.chaveNFe = p_key;			
			if(p_callback!=null) p_callback(o,null);			
		},p.data,p.headers);
	},
	
	/**
	Creates a post request.
	//*/
	post: function(p_url,p_callback,p_data,p_header)
	{
		return this.request(p_url,"POST",p_callback,p_data,p_header);
	},
	
	/**
	Creates a request.
	//*/
	request: function(p_url,p_method,p_callback,p_data,p_header)
	{		
		var params = 
		{
			url: 		p_url,
			method: 	p_method,
			encoding: 	"binary",
		};
		
		if(p_header!=null)	params.headers  = p_header;
		if(p_data!=null) 	params.form 	= p_data;
		
		return this.req(params, 
		function (p_error, p_res, p_body) 
		{
			var b = p_error==null ? p_body : null;
			var e = b!=null ? p_error : null;
			p_callback(b,e);			
		});		
	},
	
};

module.exports.NFCE = NFCE;