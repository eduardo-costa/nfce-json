/**
Class that handles the parsing of the NFCe page for the RS state.
//*/
var NFCEParser = 
{
	/**
	Webservice.
	//*/
	action: "https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp",
	
	/**
	Headers for the Webservice.
	//*/
	headers:
	{
		"Host" 			: "www.sefaz.rs.gov.br",
		"Accept" 		: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",		
		"Origin"   		: "https://www.sefaz.rs.gov.br",
		"User-Agent" 	: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",		
	},
	
	/**
	Data for the Webservice.
	//*/
	data:
	{
		HML 	: false,		
		action  : "Avan%E7ar",
	},
	
	/**
	Parses the NFCe web page and scrpa its data, returning it as JSON.
	//*/
	parse:function(p_data)
	{
		var ref = this;
		var o = {};
		
		var cheerio = require("cheerio");
		
		var html = cheerio.load(p_data);
		var q;
		var l;
		var s;
		var k = 0;
		var tag;
		
		//NFe
		o.nfe = {};
		
		l = html("#aba_nft_0 table.box tr").children();
		
		for(var i=0;i<l.length;i++)
		{	
			s="";
			tag = l[i+""];
			
			var cid = 1;
			
			if(i>17) { cid=0; }
			
			if(tag.children[cid]!=null)
			if(tag.children[cid].children[0]!=null)
			if(tag.children[cid].children[0].data!=null) s = tag.children[cid].children[0].data;
			
			if(s==null) s = "";
			
			switch(i)
			{
				
				case 0:  { o.nfe.modelo = s=="" ? -1 : parseInt(s); } break;													//Modelo				
				case 1:  { o.nfe.serie  = s=="" ? -1 : parseInt(s); } break;													//Serie				
				case 2:  { o.nfe.numero = s=="" ? -1 : parseInt(s); } break;													//Numbero				
				//case 3:  { o.nfe.dataEmissao = s=="" ? null : Date(s); } break;												//Data Emissao				
				//case 4:  { o.nfe.dataEntrada = s=="" ? null : Date(s); } break;												//Data Saida/Entrada				
				case 3:  { o.nfe.dataEmissao = s=="" ? null : ref.stjoin(ref.replaceAll(s,"\n","")," "); } break;				//Data Emissao				
				case 4:  { o.nfe.dataEntrada = s=="" ? null : ref.stjoin(ref.replaceAll(s,"\n","")," "); } break;				//Data Saida/Entrada				
				case 5:  { o.nfe.valor = s=="" ? 0.0 : parseFloat(s.replace(",",".")); } break;									//Valor Total da Nota Fiscal  				
				case 6:  { o.nfe.cnpj = s; } break;																				//CNPJ				
				case 7:  { o.nfe.nome = s; } break;																				//Nome / Razão Social				
				case 8:  { o.nfe.inscricaoEstadual = s; } break;																//Inscrição Estadual				
				case 9:  { o.nfe.uf = s; } break;																				//UF				
				case 10: { o.nfe.processo = s.replace("\n","").trim(); } break;													//Processo				
				case 11: { o.nfe.processoVer = s; } break;																		//Versao Processo				
				case 12: { o.nfe.tipoEmissao = s; } break;																		//Tipo de Emissao				
				case 13: { o.nfe.finalidade = s.replace("\n","").trim(); } break;												//Finalidade				
				case 14: { o.nfe.natureza = s.replace("\n","").trim(); } break;													//Natureza				
				case 15: { o.nfe.tipoOperacao = s.replace("\n","").trim(); } break;												//Tipo de Operação				
				case 16: { o.nfe.formaPagamento = s.replace("\n","").trim(); } break;											//Forma de Pagamento				
				case 17: { o.nfe.digest = s.replace("\n","").trim(); } break;													//Digest Value da NF-e				
				case 21: { o.nfe.eventos = s.replace("\n","").trim(); } break;													//Eventos da NF-e				
				case 22: { o.nfe.protocolo = s.replace("\n","").trim(); } break;												//Protocolo				
				//case 23: { o.nfe.dataAutorizacao = s=="" ? null : Date(s.replace("\n","").replace("às","").trim()); } break;	//Data da Autorizaçao				
				//case 24: { o.nfe.dataInclusao = s=="" ? null : Date(s.replace("\n","").replace("às","").trim()); } break;		//Data da Inclusao
				case 23: { o.nfe.dataAutorizacao = s=="" ? null : ref.stjoin(ref.replaceAll(s,"\n","")," "); } break;			//Data da Autorizaçao				
				case 24: { o.nfe.dataInclusao 	 = s=="" ? null : ref.stjoin(ref.replaceAll(s,"\n","")," "); } break;			//Data da Inclusao
			}						
		}
		
		//Emitente
		o.emitente = {};
		
		l = html("#aba_nft_1 table.box tr").children();
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];
			
			var cid = 1;
			
			if(tag.children[cid]!=null)
			if(tag.children[cid].children[0]!=null)
			if(tag.children[cid].children[0].data!=null) s = tag.children[cid].children[0].data;
			
			if(s==null) s = "";
							
			s = s.replace("�","");
			s = s.replace("�","");			
			
			switch(i)
			{
				
				case 0:  { o.emitente.nome = s; } break;														//Nome / Razão Social				
				case 1:  { o.emitente.nomeFantasia  = s; } break;												//Nome Fantasia				
				case 2:  { o.emitente.cnpj = s; } break;														//CNPJ				
				case 3:  { o.emitente.endereco = ref.clean(s,",",", ");  } break;								//Endereço				
				case 4:  { o.emitente.bairro = s.replace("\n","").trim();  } break;								//Bairro / Distrito				
				case 5:  { o.emitente.cep = s; } break;															//CEP				
				case 6:  { o.emitente.cidade = ref.stjoin(s.replace("\n",""),"-"," - ");  } break;				//Município				
				case 7:  { o.emitente.fone = s; } break;														//Telefone				
				case 8:  { o.emitente.uf = s; } break;															//UF				
				case 9:  { o.emitente.pais =  ref.stjoin(s.replace("\n",""),"-"," - ");  } break;				//País				
				case 10: { o.emitente.inscricaoEstadual = s; } break;											//Inscrição Estadual				
				case 11: { o.emitente.inscricaoEstadualSubs = s; } break;										//Inscrição Estadual do Substituto Tributário				
				case 12: { o.emitente.inscricaoMunicipal = s; } break;											//Inscrição Municipal				
				case 13: { o.emitente.municipioICMS = s.replace("\n","").trim();  } break;						//Município da Ocorrência do Fato Gerador do ICMS				
				case 14: { o.emitente.cnae = s; } break;														//CNAE Fiscal				
				case 15: { o.emitente.codigoRegimeTributario = ref.replaceAll(s,"\n","").trim();  } break;		//Código de Regime Tributário
			}
			
		}
		
		//Destinatario
		o.destinatario = {};
		
		l = html("#aba_nft_2 table.box tr").children();
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];
			
			var cid = 1;
			
			if(tag.children[cid]!=null)
			if(tag.children[cid].children[0]!=null)
			if(tag.children[cid].children[0].data!=null) s = tag.children[cid].children[0].data;
			
			if(s==null) s = "";
							
			s = s.replace("�","");
			s = s.replace("�","");			
			
			switch(i)
			{
				
				case 0:   { o.destinatario.nome 			   = s; } break; 												//Nome / Razão Social				
				case 1:   { o.destinatario.cpf  			   = s; } break;												//CNPJ/CPF/Id. Estrangeiro				
				case 2:   { o.destinatario.endereco 		   = ref.clean(s,",",", "); } break;							//Endereço
				case 3:   { o.destinatario.bairro   		   = s; } break;												//Bairro / Distrito
				case 4:   { o.destinatario.cep   			   = s; } break;												//CEP
				case 5:   { o.destinatario.cidade   		   = ref.clean(s); } break;										//Municipio
				case 6:   { o.destinatario.telefone   		   = s; } break;												//Telefone
				case 7:   { o.destinatario.uf   			   = s; } break;												//UF
				case 8:   { o.destinatario.pais   			   = ref.clean(s); } break;										//País
				case 9:   { o.destinatario.indicadorIE   	   = ref.clean(s); } break;										//Indicador IE
				case 10:  { o.destinatario.inscricaoEstadual   = s; } break;												//Inscricao Estadual
				case 11:  { o.destinatario.inscricaoSuframa    = s; } break;												//Inscricao SUFRAMA
				case 12:  { o.destinatario.im   			   = s; } break;												//IM
				case 13:  { o.destinatario.email   			   = s; } break;												//EMail
			}
			
		}
		
		//Produtos/Serviços		
		o.produtos = [];
		
		//Get products first line.
		//Num. Descrição Qtd. Unidade-Comercial Valor(R$)
		l = html("#aba_nft_3 table.toggle.box td").children();
		
		while(k<l.length)
		{
			var prod = {};
			
			
			for(var i=0;i<5;i++)
			{
				s="";
				tag = l[k+""];
				
				if(tag.children[0]!=null)				
				if(tag.children[0].data!=null) 
				s = tag.children[0].data;
				
				switch(i)
				{
					case 0: { prod.id 			= s=="" ? -1 : parseInt(s); 					} break; //Num.
					//Descrição
					case 1: 
					{ 
						prod.descricao	= ref.stjoin(s," ");
						prod.nome  		= prod.descricao.split(" ").shift();
						
						var peso 		= prod.descricao.split(" ").pop().trim();						
						
												
						prod.peso 		 = 0;
						prod.pesoUnidade = "";
						prod.items       = 1;
						
						//Ignores the brand '3M' until further notice
						if(peso=="3M") break;
						
						peso = peso.toLowerCase();
						
						var items       = "1";
						
						if(peso.indexOf("x")>=0)
						{
							items 	 	= peso.split("x").shift().trim();
							peso 	 	= peso.split("x").pop().trim();
							prod.items  = ref.toInt(items);
						}
						
						var peso_unit = peso.slice(peso.length-2);
						
						//Checks if first char is a number (then not actually a weight unit)
						if(!isNaN(parseInt(peso_unit.charAt(0)))) peso_unit = peso_unit.charAt(1);
						
						switch(peso_unit)
						{
							case "g":
							case "m":
							case "ml":
							case "l":
							case "kg": 
								if(peso_unit=="m") peso_unit = "ml";							
								prod.peso 		 = parseFloat(peso.replace(",",".").slice(0,peso.length-peso_unit.length));
								prod.pesoUnidade = peso_unit;
							break;
						}											
					} 
					break; 
					case 2: { prod.quantidade   = ref.toFloat(s);	} break; //Qts
					
					//Unidade Comercial
					case 3: 
					{ 
						prod.unidade = s.toLowerCase();						
						switch(prod.unidade)
						{
							case "g": case "m": case "ml": case "l": case "kg": 								
								prod.peso 		 = prod.quantidade;
								prod.pesoUnidade = prod.unidade;
							break;
						}						
					} 
					break; 
					case 4: {  prod.valor		= ref.toFloat(s); } break; //Valor(R$)	
				}
				
				k++;
				if(k>=l.length)break;
			}			
			
			o.produtos.push(prod);
		}
		
		q = html(".toggable.box","#aba_nft_3");
		
		for(var i=0;i<q.length;i++)
		{
			var prod = o.produtos[i];
			prod.impostos = [];
			
			var tb = html("td > table",q[i]);
			
			l = html("td",tb[0]);
			
			//Código do Produto > Valor do Seguro
			for(var k=0;k<l.length;k++)
			{
				s="";
				tag = l[k+""];				
				
				if(tag.children[1]!=null)
				if(tag.children[1].children[0]!=null)
				if(tag.children[1].children[0].data!=null) 
				s = tag.children[1].children[0].data;
				
				switch(k)
				{
					case 0:  { prod.codigo 				    = s=="" ? "" : s; 				} break; //Código
					case 1:  { prod.codigoNCM    		    = s=="" ? "" : s; 				} break; //Código NCM
					case 2:  break; 																 //EMPTY
					case 3:  { prod.codigoExTIPI 		    = s=="" ? "" : s; 				} break; //Código Ex TIPI
					case 4:  { prod.cfop 				    = s=="" ? "" : s; 				} break; //CFOP
					case 5:  { prod.despesasAcessorias 	    = ref.toFloat(s,0.0);			} break; //Outras Despesas Acessórias
					case 6:  { prod.valorDesconto 		    = ref.toFloat(s,0.0);			} break; //Valor do Desconto
					case 7:  { prod.valorFrete 			    = ref.toFloat(s,0.0);			} break; //Valor Total do Frete
					case 8:  { prod.valorSeguro 		    = ref.toFloat(s,0.0);			} break; //Valor do Seguro
					
				}
			}
			
			l = html("td",tb[1]);
			
			//Indicador de Composição do Valor Total da NF-e > Número da FCI
			for(var k=0;k<13;k++)
			{
				s="";
				tag = l[k+""];				
				
				if(tag!=null)
				if(tag.children[1]!=null)
				if(tag.children[1].children[0]!=null)
				if(tag.children[1].children[0].data!=null) 
				s = tag.children[1].children[0].data;
				
				s = ref.clean(s);
				
				switch(k)
				{
					case 0:  { prod.indicadorComposicao     = s;					} break; //Indicador de Composição do Valor Total da NF-e
					case 1:  { prod.codigoEANComercial	    = s;					} break; //Código EAN Comercial
					case 2:  { prod.unidadeComercial	    = s;					} break; //Unidade Comercial
					case 3:  { prod.quantidadeComercial	    = ref.toFloat(s,0.0);	} break; //Quantidade Comercial
					case 4:  { prod.codigoEANTributavel	    = s;					} break; //Código EAN Tributavel
					case 5:  { prod.unidadeTributavel	    = s;					} break; //Unidade Tributavel
					case 6:  { prod.quantidadeTributavel    = ref.toFloat(s,0.0);	} break; //Quantidade Tributavel
					case 7:  { prod.valorUnitarioComercial  = ref.toFloat(s,0.0);	} break; //Valor unitário de comercialização
					case 8:  { prod.valorUnitarioTributavel = ref.toFloat(s,0.0);	} break; //Valor unitário de tributação
					case 9:  { prod.numeroPedidoCompra	    = s; 					} break; //Número do pedido de compra
					case 10: { prod.itemPedidoCompra	    = s; 					} break; //Item do pedido de compra
					case 11: { prod.valorAproxTributos	    = ref.toFloat(s,0.0);	} break; //Valor Aproximado dos Tributos
					case 12: { prod.numeroFCI			    = s;					} break; //Número da FCI
				}
				
			}
			
			tb = html("table.box",tb[1]);
			
			l = html("td",tb[0]);
			
			var m;
			var imposto;
			
			m = l.length;
			prod.impostos.push(imposto = {nome:"icms"});
			
			//ICMS
			for(var k=0;k<6;k++)
			{
				s="";
				tag = l[k+""];				
				
				if(tag!=null)
				if(tag.children[1]!=null)
				if(tag.children[1].children[0]!=null)
				if(tag.children[1].children[0].data!=null) 
				s = tag.children[1].children[0].data;
				
				s = ref.clean(s);
				
				switch(k)
				{
					case 0: { imposto.origem = s; 							} break; //Origem da Mercadoria
					case 1: { imposto.tributacao = s; 						} break; //Tributação do ICMS					
					case 2:  
					{
						imposto.valorBCRetido = m==4 ? ref.toFloat(s) : 0.0;  		 //Valor da BC do ICMS ST retido
						imposto.modalidade    = m==6 ? s : ""; 	  			  		 //Modalidade Definição da BC ICMS NORMAL
					}
					break;
					case 3:
					{
						imposto.valorRetido 	 = m==4 ? ref.toFloat(s) : 0.0;		 //Valor do ICMS ST retido
						imposto.base    		 = m==6 ? ref.toFloat(s) : s;   	 //Base de Cálculo do ICMS Normal
					}
					break;
					
					case 4: { imposto.aliquota  = ref.toFloat(s); } break; 			 //Alíquota do ICMS Normal
					case 5: { imposto.valor 	= ref.toFloat(s); } break; 			 //Valor do ICMS Normal
					
				}
				
				//console.log("  ["+m+"]"+k+" "+s);
				
			}
						
			
			l = html("td",tb[1]);
			
			m = l.length;
			prod.impostos.push(imposto = {nome:"pis"});
			
			//PIS
			for(var k=0;k<4;k++)
			{
				s="";
				tag = l[k+""];				
				
				if(tag!=null)
				if(tag.children[1]!=null)
				if(tag.children[1].children[0]!=null)
				if(tag.children[1].children[0].data!=null) 
				s = tag.children[1].children[0].data;
				
				s = ref.clean(s);
				
				switch(k)
				{
					case 0: { imposto.cst  	   = s; 								} break; //CST
					case 1: { imposto.base 	   = m==1 ? 0.0 : ref.toFloat(s);		} break; //Alíquota					
					case 2: { imposto.valor    = m==1 ? 0.0 : ref.toFloat(s);		} break; //Valor					
				}								
			}
			
			l = html("td",tb[2]);
			
			m = l.length;
			prod.impostos.push(imposto = {nome:"cofins"});
			
			//COFINS
			for(var k=0;k<4;k++)
			{
				s="";
				tag = l[k+""];				
				
				if(tag!=null)
				if(tag.children[1]!=null)
				if(tag.children[1].children[0]!=null)
				if(tag.children[1].children[0].data!=null) 
				s = tag.children[1].children[0].data;
				
				s = ref.clean(s);
				
				switch(k)
				{
					case 0: { imposto.cst  	   = s; 								} break; //CST
					case 1: { imposto.base 	   = m==1 ? 0.0 : ref.toFloat(s);		} break; //Alíquota					
					case 2: { imposto.valor    = m==1 ? 0.0 : ref.toFloat(s);		} break; //Valor					
				}								
			}
			
		}
		
		//Totais
		l = html("td","#aba_nft_4");
		
		o.impostos = {};
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];				
			
			if(tag!=null)
			if(tag.children[1]!=null)
			if(tag.children[1].children[0]!=null)
			if(tag.children[1].children[0].data!=null) 
			s = tag.children[1].children[0].data;
			
			s = ref.clean(s);
			
			switch(i)
			{
				case 0:  { o.impostos.baseICMS  		 	= ref.toFloat(s); } break; //Base de Cálculo ICMS
				case 1:  { o.impostos.icms 			 		= ref.toFloat(s); } break; //Valor do ICMS
				case 2:  { o.impostos.icmsDesonerado  		= ref.toFloat(s); } break; //Valor do ICMS Desonerado
				case 3:  { o.impostos.icmsST 		 		= ref.toFloat(s); } break; //Base de Cálculo ICMS ST					
				case 4:  { o.impostos.icmsSubs 		 		= ref.toFloat(s); } break; //Valor ICMS Substituição
				case 5:  { o.impostos.totalProdutos 		= ref.toFloat(s); } break; //Valor Total dos Produtos
				case 6:  { o.impostos.totalFrete  	 		= ref.toFloat(s); } break; //Valor do Frete
				case 7:  { o.impostos.totalSeguro 	 		= ref.toFloat(s); } break; //Valor do Seguro				
				case 8:  { o.impostos.despesasAcessorias	= ref.toFloat(s); } break; //Outras Despesas Acessórias
				case 9:  { o.impostos.totalIPI 				= ref.toFloat(s); } break; //Valor Total do IPI
				case 10: { o.impostos.totalNFE 				= ref.toFloat(s); } break; //Valor Total da NFe
				case 11: { o.impostos.totalDescontos 		= ref.toFloat(s); } break; //Valor Total dos Descontos				
				case 12: { o.impostos.totalII 				= ref.toFloat(s); } break; //Valor Total do II
				case 13: { o.impostos.pis 					= ref.toFloat(s); } break; //Valor do PIS
				case 14: { o.impostos.cofins 				= ref.toFloat(s); } break; //Valor da COFINS
				case 15: { o.impostos.tributosAprox 		= ref.toFloat(s); } break; //Valor Aproximado dos Tributos			
			}
		}
		
		//Transporte
		l = html("td","#aba_nft_5");
		
		o.transporte = {};
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];				
			
			if(tag!=null)
			if(tag.children[1]!=null)
			if(tag.children[1].children[0]!=null)
			if(tag.children[1].children[0].data!=null) 
			s = tag.children[1].children[0].data;
			
			s = ref.clean(s);
			
			switch(i)
			{
				case 0: { o.transporte.modalidade = s; } break; //Modalidade
			}
		}
		
		//Cobrança
		l = html("td","#aba_nft_6");
		
		o.cobranca = {};
		
		for(var i=5;i<l.length;i++)
		{
			s="";
			tag = l[i+""];				
			
			if(tag!=null)
			if(tag.children[0]!=null)			
			if(tag.children[0].children[0]!=null)	
			if(tag.children[0].children[0].data!=null) 
			s = tag.children[0].children[0].data;
			
			s = ref.clean(s);
			
			switch(i)
			{
				case 5: { o.cobranca.forma 	  	 = s; 					} break; //Forma de Pagamento
				case 6: { o.cobranca.valor 	  	 = ref.toFloat(s); 		} break; //Valor do Pagamento
				case 7: { o.cobranca.cnpjCred    = s; 					} break; //CNPJ da Credenciadora
				case 8: { o.cobranca.bandeira    = s;			 		} break; //Bandeira da operadora
				case 9: { o.cobranca.autorizacao = s;			 		} break; //Número de autorização
			}
		}
		
		//Informações Adicionais
		tb = html("table.box","#aba_nft_7");
		
		o.info = {};
		
		o.info.xsltVersion = ref.clean(html("#Versao","#aba_nft_7").text());
		
		o.info.xsltVersion = o.info.xsltVersion.toLowerCase().replace("xslt","").replace(":","").replace("v","").trim();
		
		l = tb[0]==null ? [] : html("td",tb[0]);
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];				
			
			if(tag!=null)
			if(tag.children[1]!=null)			
			if(tag.children[1].children[0]!=null)	
			if(tag.children[1].children[0].data!=null) 
			s = tag.children[1].children[0].data;
			
			s = ref.clean(s);
			
			switch(i)
			{
				case 0: { o.info.formato = s; } break; //Formato de Impressão DANFE
			}
		}
		
		l = tb[1]==null ? [] : html("td",tb[1]);
		
		for(var i=0;i<l.length;i++)
		{
			s="";
			tag = l[i+""];				
			
			if(tag!=null)
			if(tag.children[1]!=null)			
			if(tag.children[1].children[0]!=null)	
			if(tag.children[1].children[0].children[0]!=null)	
			if(tag.children[1].children[0].children[0].data!=null) 
			s = tag.children[1].children[0].children[0].data;
			
			s = ref.clean(s);
			
			switch(i)
			{
				case 0: { o.info.descricao = s; } break; //Informações Complementares de Interesse do Contribuinte
			}
		}
		
		return o;
	},
	
	/**
	Split, Trim and Join
	//*/
	stjoin:function(p_v,p_sep,p_new_sep)
	{
		var l = p_v.split(p_sep);
		for(var i=0;i<l.length;i++) if(l[i]=="") l.splice(i--,1);
		var ns = p_new_sep==null ? p_sep : p_new_sep;
		for(var i=0;i<l.length;i++) l[i] = l[i].trim();
		return l.join(ns);
	},
	
	/**
	Adjusts the value and returns it as float.
	//*/
	toFloat:function(p_v,p_default)
	{
		var dft = p_default==null ? 0.0 : p_default;		
		var n   = parseFloat(p_v.replace(",","."));
		return isNaN(n) ? dft : n;
	},
	
	/**
	Adjusts the value and returns it as int.
	//*/
	toInt:function(p_v,p_sep,p_new_sep,p_default)
	{
		var dft = p_default==null ? 0 : p_default;
		var n   = parseInt(p_v.replace(",","."));
		return isNaN(n) ? dft : n;
	},
	
	/**
	Replaces all occurences of 'v' by 'r'
	//*/
	replaceAll: function(p_s,p_v,p_r)
	{
		if(p_v==p_r) return p_s;
		while(p_s.indexOf(p_v)>=0) p_s = p_s.replace(p_v,p_r);
		return p_s;
	},
	
	/**
	Remove line breaks and adjusts spacing.
	//*/
	clean: function(p_v,p_sep,p_new_sep)
	{		
		var ref = this;
		p_sep = p_sep==null ? " " : p_sep;
		p_new_sep = p_new_sep==null ? p_sep : p_new_sep;
		return ref.stjoin(ref.stjoin(ref.replaceAll(p_v,"\n",""),p_sep,p_new_sep)," ");
	},
};

module.exports.NFCEParser = NFCEParser;