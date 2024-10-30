window.onload = function () {
	var widgetId = document.querySelector("#widgetId").value;
	var widgetThemeColor = document.querySelector("#widgetThemeColor").value;
	var imageLogo = document.querySelector("#logoUrl").value;
	var widgetName = document.querySelector("#widgetName").value;
	var domainName = document.querySelector("#widgetDomain").value;
	this.console.log("the widgetId id is: "+widgetId);
	if (widgetId && widgetId != null && widgetId != "" && widgetName ) {
		configTheLoader(true);
		addSingleWidgetConfiguration(widgetId,widgetName,domainName,imageLogo,widgetThemeColor);
		configRespectivePage("#single-widget-setup");
		configTheLoader(false);
		configErrorPage(false);
	}
	else {
		configTheLoader(false);
		configErrorPage(false);
		configRespectivePage("#connect-widget-setup");
	}	
	document.querySelector("#cwa-login").onclick = function () {
		configTheBasicLoader(true);
		var siteUrl = this.getAttribute("siteurl");
	    var windowWidth  = 520;
		var windowHeight = 680;
		var posLeft = (window.screen.width / 2) - ((windowWidth / 2) + 10);
	    var posTop = (window.screen.height / 2) - ((windowHeight / 2) + 20);      
		var popupWindow = window.open('https://app.chatsupport.co/?source=wordpress&siteUrl=' + siteUrl, "_blank", 'scrollbars=yes,resizable=0,width='+windowWidth+', height='+windowHeight+', top='+posTop+', left='+posLeft+'');
		popupWindow.focus();
		var pollTimer = window.setInterval(function () {
			configTheBasicLoader(true);
			if (popupWindow.closed) {
				configTheBasicLoader(false);
				clearInterval(pollTimer);
				configRespectivePage("#connect-widget-setup");
			}else{
				if (popupWindow && popupWindow.location && popupWindow.location.href.indexOf("success=true") != -1) {
					const urlParams = new URLSearchParams(popupWindow.location.search);
					configTheLoader(true);
					var request = new XMLHttpRequest()
					request.open('GET', 'https://app.chatsupport.co/api/account/'+urlParams.get("accountID"), true)
					request.onload = function() {
						var response = JSON.parse(this.response)
						if (request.status >= 200 && request.status < 400) {
							  console.log("data is:",response);
						  if( response.data != null && response.data.hasOwnProperty("widget") && response.data.widget.length <= 0){
							configErrorPage(true);
						  }else  if( response.data != null && response.data.hasOwnProperty("widget") && response.data.widget.length > 1){
							configTheLoader(true);
							configRespectivePage("#multiple-widget-setup");
							configErrorPage(false);
							for(var widgetIndex = 0 ; widgetIndex <   response.data.widget.length ; widgetIndex ++){
								var widget = response.data.widget[widgetIndex];
								addMultipleWidgetConfiguration(widget);
							}
							configTheLoader(false);
						  }else  if( response.data != null && response.data.hasOwnProperty("widget") && response.data.widget.length == 1){
							configTheLoader(true);
							configErrorPage(false);
							var singleWidget = response.data.widget[0];
							var widgetName = singleWidget.name;
							var domainName = singleWidget.domain;
							var imageLogo = singleWidget.logoUrl;
							var widgetId = singleWidget.id;
							var widgetThemeColor = singleWidget.widgetThemeColor;
							document.querySelector("#connect-widget-setup").style.display = "none";
							saveWidgetConfiguration(widgetId,widgetName,domainName,imageLogo,widgetThemeColor);
							configTheLoader(false);
						 }else{
							configTheLoader(false);
							configTheBasicLoader(false);
							configErrorPage(true);
							configRespectivePage("#connect-widget-setup");
						}
							configTheLoader(false);
						}else if (popupWindow.location.href.indexOf("success=false") != -1) {
							configTheLoader(false);
							configTheBasicLoader(false);
							configErrorPage(true);
							configRespectivePage("#connect-widget-setup");
						}
					}
					request.setRequestHeader("Content-Type", "application/json");
					request.send();
					clearInterval(pollTimer);
					popupWindow.close();
				}else if ( popupWindow && popupWindow.location && popupWindow.location.href.indexOf("success=false") != -1){
                 configTheBasicLoader(false);
                 configErrorPage(true);
				 configRespectivePage("#connect-widget-setup");
                 clearInterval(pollTimer);
				 popupWindow.close();
              }
			}
		}, 1000);
		configTheBasicLoader(false);
	}

	var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

	//Function to convert rgb color to hex format
	function rgb2hex(rgb) {
 		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

	function hex(x) {
  		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}

	function addSingleWidgetConfiguration(widgetId,widgetName,domainName,imageLogo,widgetThemeColor){
		widgetThemeColor = (widgetThemeColor.startsWith("#")) ? widgetThemeColor.substr(1) : widgetThemeColor
		var singleWidget = document.querySelector('#single-widget-setup section aside');
		var isImageAvaiable = (imageLogo && imageLogo != "https://assets.chatsupport.co/chat/images/icon-chat.svg") ? "block" :"none";
		var isDomainAvailable = (domainName) ? "block" : "none";
		singleWidget.insertAdjacentHTML('beforeend', '<div style="cursor:default" id='+widgetId+'><figure style="background-color:#'+widgetThemeColor+'"><cite style="border-color:#'+widgetThemeColor+'"></cite>'+
		'<img style="display:'+isImageAvaiable+'" src="'+imageLogo+'"/></figure>'+
		 '<label style="cursor:default">'+widgetName+'</label>'+
		 '<span style="display:'+isDomainAvailable+'">'+domainName+'</span></div>');
	}

	function saveWidgetConfiguration(widgetId,widgetName,domainName,imageLogo,widgetThemeColor){
		document.querySelector("#widgetId").value = widgetId;
		document.querySelector("#widgetThemeColor").value = widgetThemeColor;
		document.querySelector("#logoUrl").value = imageLogo;
		document.querySelector("#widgetName").value = widgetName;
		document.querySelector("#widgetDomain").value = domainName;
		document.querySelector("#submit").click();
	}

	function configRespectivePage(enableThis){
		if(enableThis === "#multiple-widget-setup"){
			document.querySelector("#connect-widget-setup").style.display = "none";
			document.querySelector("#multiple-widget-setup").style.display = "block";
			document.querySelector("#single-widget-setup").style.display = "none";
		}else if(enableThis === "#single-widget-setup"){
			document.querySelector("#connect-widget-setup").style.display = "none";
			document.querySelector("#multiple-widget-setup").style.display = "none";
			document.querySelector("#single-widget-setup").style.display = "block";
		}else if(enableThis === "#connect-widget-setup"){
			document.querySelector("#connect-widget-setup").style.display = "block";
			document.querySelector("#multiple-widget-setup").style.display = "none";
			document.querySelector("#single-widget-setup").style.display = "none";
			document.querySelector("#cwa-login").style.display = "inline-block";
		}
	}	
	function configTheLoader(enable){
		if(enable){
			document.querySelector(".wordpress-loader").style.display = "block";
			document.querySelector(".wordpress-bg").style.display = "block";
			document.querySelector(".bg").style.display = "none";
		}else{
			document.querySelector(".wordpress-loader").style.display = "none";
			document.querySelector(".wordpress-bg").style.display = "none";
		}
	}

	function configTheBasicLoader(enable){
		if(enable){
			if(document.querySelector("#cwa-login")){
				document.querySelector("#cwa-login").style.display = "none";
			}
			document.querySelector(".btn-progressing").style.display = "inline-block";
			document.querySelector(".bg").style.display = "block";
		}else{
			document.querySelector(".bg").style.display = "none";
			document.querySelector(".btn-progressing").style.display = "none";
		}
	}


	function configErrorPage(enable){
		if(enable){
			document.querySelector(".wordpress-error").style.display = "block";
			document.querySelector(".wordpress-bg").style.display = "block";
		}else{
			document.querySelector(".wordpress-error").style.display = "none";
			document.querySelector(".wordpress-bg").style.display = "none";
		}
	}

	if(document.querySelector(".wordpress-error")){
		document.querySelector(".wordpress-error #error-frame").onclick = function(){
			configErrorPage(false);
			configRespectivePage("#connect-widget-setup");
		}
	}

	function addMultipleWidgetConfiguration(widgetData){
		var widgetName = widgetData.name;
		var domainName = widgetData.domain;
		var imageLogo = widgetData.logoUrl;
		var widgetId = widgetData.id;
		var widgetThemeColor = widgetData.widgetThemeColor;
		var isImageAvaiable = (imageLogo && imageLogo != "https://assets.chatsupport.co/chat/images/icon-chat.svg") ? "block" :"none";
		var isDomainAvailable = (domainName) ? "block" : "none";
		var d1 = document.querySelector('#multiple-widget-setup section');
		d1.insertAdjacentHTML('beforeend', '<aside><div id='+widgetId+'><figure style="background-color:#'+widgetThemeColor+'"><cite style="border-color:#'+widgetThemeColor+'"></cite>'+
		'<img style="display:'+isImageAvaiable+'" src="'+imageLogo+'"/></figure>'+
		'<label>'+widgetName+'</label>'+
		'<span style="display:'+isDomainAvailable+'">'+domainName+'</span></div></aside>');
			if(d1.querySelector("aside")){
			d1.querySelector('aside #'+widgetId).onclick = function(){
				configTheLoader(true);
				saveWidgetConfiguration(this.id,this.querySelector("label").innerText,this.querySelector("span").innerText,this.querySelector("img").src,rgb2hex(this.querySelector("figure").style["background-color"]));
				configTheLoader(false);
			}
		}
	}
}



