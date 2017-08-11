;
// //////////////////////////////////////
// ///////////全局函数////////////////////
// /////////////////////////////////////
// 获取请求头路径
$.mpbGetHeaderPath = function() {
	var strFullpath = window.document.location.href;
	var strPath = window.document.location.pathname;
	var pos = strFullpath.indexOf(strPath);
	var prePath = strFullpath.substring(0, pos);
	var enName = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
	return prePath +enName;
};




// 获取参数值(根据key获取value)
$.mpbGetParameter = function(key) {
	var str = window.location.search;
	var num_str = str.indexOf("&" + key + "=") != -1 ? str.indexOf("&" + key + "=")
			: str.indexOf("?" + key + "=");
	if (num_str == -1) {
		return null;
	}
	str = str.substr(num_str + 1);
	var arrtmp = str.split("&");
	num_str = arrtmp[0].indexOf("=");
	if (num_str == -1) {
		return null;
	}
	return decodeURI($.decode(arrtmp[0].substr(num_str + 1)));
	
};

//获取参数值(根据key获取value)
$.mpbGetUrlParameter = function(key) {
	var str = window.location.search;
	num = str.indexOf("&" + key + "=") != -1 ? str.indexOf("&" + key + "=")
			: str.indexOf("?" + key + "=");
	if (num == -1) {
		return null;
	}
	str = str.substr(num + 1);
	var arrtmp = str.split("&");
	num = arrtmp[0].indexOf("=");
	if (num == -1) {
		return null;
	}
	return decodeURI(arrtmp[0].substr(num + 1));
};
// base64加密解密
var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
		+ "wxyz0123456789+/" + "=";

$.encode = function(input) {
	input += "_mpb";
	input = escape(input);
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
				+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);
	return output;
};
$.decode = function(input) {
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;

	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	var base64test = /[^A-Za-z0-9\+\/\=]/g;
	if (base64test.exec(input)) {
//		alert("There were invalid base64 characters in the input text.\n"
//				+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n"
//				+ "Expect errors in decoding.");
	}
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	do {
		enc1 = keyStr.indexOf(input.charAt(i++));
		enc2 = keyStr.indexOf(input.charAt(i++));
		enc3 = keyStr.indexOf(input.charAt(i++));
		enc4 = keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		output = output + String.fromCharCode(chr1);
		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);
	output = unescape(output);
	return output.replace("_mpb", "");
};

$.showErr = function(message) {
	var inf = "错误!" + message;
	console.log(inf);
	if(message=="用户未登录"){
		$.message({type:"AutoInfo",message:"用户登录超时",callback:function(){
			$.mpbJumpOpen("/pages/login/login.html",{params:{"channel":"mobile-site","target":window.location.href}});
		}});
	}else{
		$.message({type:"Info",message:inf});
//		$.mpbJumpOpenNot("/pages/sys/error.html");
	}
};

//type Info、Question、AutoInfo
$.message = function(opts) {
	var def = {
		type : "Info",
		message : "操作成功!",
		callback: function(){
			
		}
	};
	opts = $.extend(true,def, opts);
	eval("mpb"+opts.type+"Dialog"+"('"+opts.message+"',"+opts.callback+")");

};

//mpbGetJson 用于jsonp的处理
$.mpbGetJson = function(url, postData, callback, errorexcute,errornotshow) {

	var isTimeout = true;// set this true
	setTimeout(function() {
		checkTimeout();
	}, 30000);// 30 seconds

	url = $.mpbGetHeaderPath() + url + "?";
	if ($.isNotBlank(postData)) {
		for ( var key in postData) {
			url = url + key + "=" + postData[key] + "&";
		}
	}
	url = url + "callback=?";
	$.getJSON(url, function(data) {
		isTimeout = false;
		if (!data.data.success) {
			//判断是不是弹错误
			if(errornotshow != true){
				$.showErr(data.data.error);
			}
			if (errorexcute != true) {
				return;
			}
		}
		callback(data);
	});

	function checkTimeout() {
		if (isTimeout) {
			$.message({type:"AutoInfo",message:"请求超时"});
		}
	}
};
// post 请求
$.mpbPost = function(url, postData, callback) {
	var defaultPost = {
		"_method" : "POST"
	};
	postData = $.extend(true, defaultPost, postData);
	$.post($.mpbGetHeaderPath() + url, postData, callback, "json").success(
			function() {
			}).error(function() {
	//			alert("出错了");
//				$.mpbTips({icon : "error",content : "请求失败,请联系管理员"});
//				$.mpbJumpOpen("/login.html");
	});
};

// refresh
$.mpbRefresh = function(formId, tableId, callback) {
	$("#" + formId).mpbReset();
	$("#" + tableId).setGridParam({
		page : 1
	});
	callback();
};

// UUID
$.uuid = function(len, radix) {// 长度,进制
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			.split('');
	var chars = CHARS, uuid = [], i;
	radix = radix || chars.length;
	if (len) {
		for (i = 0; i < len; i++)
			uuid[i] = chars[0 | Math.random() * radix];
	} else { // rfc4122, version 4 form
		var r; // rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
};

// 权限过滤
$.loadPermFunc = function() {
	var perm = "";
	$(document).find("[permid]").each(function() {
		if(perm.indexOf($(this).attr("permid")) == -1) {
			perm = perm + $(this).attr("permid") + ",";
		}
	});
	if (perm != "") {
		perm.substring(0, perm.length - 1);
		$.mpbPost(
				"/admin/resource/func/" + perm,
				{
					"_method" : "GET"
				},
				function(data) {
					var permData = "," + data + ",";
					$(document)
							.find("[permid]")
							.each(
									function() {
										if (permData
												.indexOf((","
														+ $(this)
																.attr(
																		"permid") + ",")) == -1) {
											$(this).remove();
										}
									});
				});
	}

};
// ///////////////////////////////////////////////////
// ////////////////对象函数////////////////////////////
// ///////////////////////////////////////////////////
(function($) {
	// 填充form
	$.fn.mpbFillForm = function(config) {
		if (!this.is("form")) {
			alert("此函数只针对于form控件使用");
			return;
		}
		var form = this;
		var def={
			"url" : "/get",
			"_method" : "get",
			"id" : $.mpbGetParameter("id"),
			"mpbClass" : $(form).attr("queryclass")
		};
		config = $.extend(true, def, config);
		var callback = config.callback;
		delete config.callback;
		$
				.ajax({
					url : $.mpbGetHeaderPath() + config.url,
					data : config,
					cache : false,
					async : false,
					type : "POST",
					dataType : 'json',
					success : function(data) {
						function fillData(form, data, nameValue) {
							if(typeof(data)=="string"){
								data = eval('('+data+')');
							}
							if ($.isNotBlank(data)) {
								for ( var key in data) {
									var name = "[name=" + key + "]";
									// var tempName = "";
									// if (nameValue != "" && nameValue != null
									// && nameValue != "undifined") {
									// name = "[name='" + nameValue + "." + key
									// + "']";
									// tempName = nameValue + "." + key;
									// }
									var domArray = form.find(name);
									if (domArray.length == 0) {
										// if (tempName != "") {
										// fillData(form, data[key], tempName);
										// } else {
										// fillData(form, data[key], key);
										// }
									} else {
										for ( var j = 0; j < domArray.length; j++) {
											var $dom = $(domArray[j]);
											if ($dom.is(":radio")
													|| $dom.is(":checkbox")) {
												if ($dom.is(":radio")) {
													if ($dom.val() == data[key]) {
														$dom.attr("checked",
																true);
													}
												}
												if ($dom.is(":checkbox")) {
													if (data[key] == "0") {
														$dom.attr("checked",
																true);
													}
												}
											} else {
												$dom.val(data[key].toString()
														.replace(/<br>/g,
																"\r\n"));
											}
											$dom.change();
										}
									}
								}
							}
						}
						fillData(form, data);
						if ($.isNotBlank(callback)) {
							callback(data);
						}
					}
				});
	};
	// fill data
	$.fn.mpbFillData = function(data) {
		var container = this;
		if (data != null) {
			for ( var key in data) {
				var name = "[name=" + key + "]";
				var domArray = container.find(name);
				for ( var j = 0; j < domArray.length; j++) {
					var $dom = $(domArray[j]);
					if ($dom.is(":radio") || $dom.is(":checkbox")) {
						if ($dom.is(":radio") && $dom.val() == data[key]) {
							$dom.attr("checked", true);
						}
						if ($dom.is(":checkbox") && data[key] == "0") {
							$dom.attr("checked", true);
						}
					} else {
						$dom.val(data[key].toString().replace(/<br>/g, "\r\n"));
					}
					if ($dom.is("select")) {
						$dom.change();
					}
				}
			}
		}
	};
	// form2json
	$.fn.mpbForm2json = function() {
		var result = "";
		var serializedParams = this.serialize();
		serializedParams = decodeURIComponent(serializedParams, true);
		function bulidJsonStr(str) {
			var attributeName = str.split("=")[0];
			var attributeValue = str.split("=")[1];
			if (!attributeValue) {
				attributeValue = '';
			}
			return "\"" + attributeName + "\":\"" + attributeValue + "\",";
		}
		var properties = serializedParams.split("&");
		for ( var i = 0; i < properties.length; i++) {
			result += bulidJsonStr(properties[i]);
		}
		result = "{" + result + "}";
		result = result.replace(/,}/g, "}").replace(/\r\n/g, "<br>").replace(
				/\+/g, " ");
		return eval('(' + result + ')');
	};
	// formTojsonString
	$.fn.mpbFormToJsonString = function() {
		var result = "";
		var serializedParams = this.serialize();
		serializedParams = decodeURIComponent(serializedParams, true);
		function bulidJsonStr(str) {
			var attributeName = str.split("=")[0];
			var attributeValue = str.split("=")[1];
			if (!attributeValue) {
				attributeValue = '';
			}
			return "\"" + attributeName + "\":\"" + attributeValue + "\",";
		}
		var properties = serializedParams.split("&");
		for ( var i = 0; i < properties.length; i++) {
			result += bulidJsonStr(properties[i]);
		}
		result = "{" + result + "}";
		result = result.replace(/,}/g, "}").replace(/\r\n/g, "<br>").replace(
				/\+/g, " ");
		return result;
	};
	// form重置
	$.fn.mpbReset = function() {
		this[0].reset();
	};
	// 填充下拉框
	$.fn.mpbFillCombo = function(url, data, opts, callback) {
		if (!this.is("select")) {
			alert("此函数只针对于select控件使用");
			return;
		}
		if(!$.isNotBlank(url)){
			url = "/chosenlist";
		}
		var combo = this;
		var defaults = {
			opName : "name",
			opId : "id",
			url : $.mpbGetHeaderPath() + url,
			data : data,
			cache : false,
			async : false,
			type : "POST",
			dataType : 'json',
			success : function(resultData) {
				if (resultData != null) {
					$.each(resultData, function(i, item) {
						combo.append("<option value=" + item[opts.opId] + ">"
								+ item[opts.opName] + "</option>");
					});
					if (callback != undefined && callback != null
							&& callback != "") {
						callback(resultData);
					}
				}
			}
		};
		var opts = $.extend(true, defaults, opts);
		$.ajax(opts);
	};
	
	// 填充下拉框_城市
	$.fn.mpbFillCombo_city = function(url, data, opts, callback) {
		if (!this.is("select")) {
			alert("此函数只针对于select控件使用");
			return;
		}
		if(!$.isNotBlank(url)){
			url = "/chosenlist";
		}
		var combo = this;
		var defaults = {
			opName : "name",
			opId : "id",
			url : $.mpbGetHeaderPath() + url,
			data : data,
			cache : false,
			async : false,
			type : "POST",
			dataType : 'json',
			success : function(resultData) {
				if (resultData != null) {
					$.each(resultData, function(i, item) {
						combo.append("<option value='" + item[opts.opName] +"'pro='"+item[opts.opId]+"'>"
								+ item[opts.opName] + "</option>");
					});
					if (callback != undefined && callback != null
							&& callback != "") {
						callback(resultData);
					}
				}
			}
		};
		var opts = $.extend(true, defaults, opts);
		$.ajax(opts);
	};

	$.fn.addRow = function(targetId, callback) {
		var $row = this.clone(true);
		$row.find("select").chosen();
		if (callback != undefined) {
			// $row.fillData(callback());
		}
		$row.appendTo("#" + targetId);
		return $row;
	};
	$.fn.delRow = function() {
		this.parent().remove();
	};

})(jQuery);


// //////////////////////////////////////////////
// ////////////common function///////////////////
// //////////////////////////////////////////////

$.mpbJumpOpen = function(url, opts) {
	var def = {
		title : "",
		id : ""
	};
	opts = $.extend(true, def, opts);
	var opparams = opts.params;
	if ($.isNotBlank(opparams)) {
		url = url + "?";
		for ( var key in opparams) {
			url = url + key + "=" + $.encode(opparams[key]) + "&";
		}
	}
	if (url.indexOf("?") != -1) {
		url = url.substring(0, url.length - 1);
	}
	window.location.href = $.mpbGetHeaderPath() + url;
};

// 处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpace(e) {
	var ev = e || window.event; // 获取event对象
	var obj = ev.target || ev.srcElement; // 获取事件源
	var t = obj.type || obj.getAttribute('type'); // 获取事件源类型
	// 获取作为判断条件的事件类型
	var vReadOnly = obj.readOnly;
	var vDisabled = obj.disabled;
	// 处理undefined值情况
	vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
	vDisabled = (vDisabled == undefined) ? true : vDisabled;
	// 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
	// 并且readOnly属性为true或disabled属性为true的，则退格键失效
	var flag1 = ev.keyCode == 8
			&& (t == "password" || t == "text" || t == "textarea")
			&& (vReadOnly == true || vDisabled == true);
	// 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
	var flag2 = ev.keyCode == 8 && t != "password" && t != "text"
			&& t != "textarea";
	// 判断
	if (flag2 || flag1)
		return false;
}
// 禁止后退键 作用于Firefox、Opera
document.onkeypress = forbidBackSpace;
// 禁止后退键 作用于IE、Chrome
document.onkeydown = forbidBackSpace;

// 判断是否为空
$.isNotBlank = function(value) {
	if (value != undefined && value != "undefined" && value != null
			&& value != "null" && value != "") {
		return true;
	}
	return false;
};

$.mpbAjax = function(url, opts) {
	var def = {
		type : "POST",
		url : $.mpbGetHeaderPath() + url,
		async : true,
		data : {
			"_method" : "POST"
		},
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status!="200"){
            	alert("出错拉");
            }
        }
	};
	opts = $.extend(true, def, opts);
	$.ajax(opts);
};

$.mpbValidate = function(value, regex, alertText) {
	if (!regex.test(value)) {
		$.mpbTips({icon : "warning",content : alertText});
		return false;
	}
	return true;
};

// 获取鼠标坐标位置
$.mousePos = function(e) {
	var x, y;
	var e = e || window.event;
	return {
		x : e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft,
		y : e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop
	};
};

// /////////////////////////////////////////
// /////原型函数 为js类型绑定相应的方法////////////
// ////////////////////////////////////////

// 日期类型
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

// 数字类型

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为 精确的除法结果。
Number.prototype.div = function(arg) {
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = this.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		t2 = arg.toString().split(".")[1].length;
	} catch (e) {
	}
	with (Math) {
		r1 = Number(this.toString().replace(".", ""));
		r2 = Number(arg.toString().replace(".", ""));
		return (r1 / r2) * pow(10, t2 - t1);
	}
};

// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数 相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
Number.prototype.mul = function(arg) {
	var m = 0, s1 = this.toString(), s2 = arg.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
			/ Math.pow(10, m);

};

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法 结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
Number.prototype.add = function(arg) {
	var r1, r2, m;
	try {
		r1 = this.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (this * m + arg * m) / m;
};

// 减法函数，用来得到精确的减法结果
// 说明：javascript的减法 结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
Number.prototype.sub = function(arg) {
	var r1, r2, m, n;
	try {
		r1 = this.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	// 动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((this * m - arg * m) / m).toFixed(n);
};


String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
};
// ///////////////////////////////////////////////
// //////////////////执行函数//////////////////////
// //////////////////////////////////////////////
$(function() {
//	$.loadPermFunc();
	// 绑定查询事件
	var form = $("form")[0];
	if ($(form).find("[op]").length > 0) {
		$(form).find("[op]").each(function(i) {
			$(this).bind("keydown", function(e) {
				if (e.keyCode == 13) {
					$(form).find(".blue_button").click();
					return false;
				}
			});
		});
	} else {
		var islogin = true;
		// 将form内除textarea的回车事件更改为tab事件 只支持IE 并且 chosen组件在其内进行更改
		$(form).find("input").each(function(){
			if($(this).attr("name")=="j_password"){
				islogin = false;
			}
		});
		$(form)
				.find(
						"input[type=text],input[type=password],input[type=submit],input[type=button],select,button,input[type=radio],input[type=checkbox]")
				.each(function() {
					$(this).bind("keydown", function() {
						if (event.keyCode == 13) {
							if(islogin){
								event.keyCode = 9;
							}
						}
					});
				});
	}
});

$.mpbSetCookie = function(key,value,opt){
	if(!$.isNotBlank(opt)){
		$.cookie(key,value);
	}else{
		//opt 参数格式如：{expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true}
		$.cookie(key,value,opt);
	}
};
$.mpbGetCookie = function(key){
	return $.cookie(key);
};

//表单验证，浮动层提示，可传参数mesg（如：XXX不能为空，只能单选等文字性提示信息）
var _promptTextAll="";
$.mpbValidat = function(mesg){
	if(!$.isNotBlank(mesg)){
		mesg = "";
	}
	$(".error_tips").empty();
	mesg = mesg+ _promptTextAll;//mesg 为手动传来的消息，promptTextAll为验证框架验证的提示信息
	_promptTextAll="";
	$("#artDialogDemoBox").append("<div class='error_tips'><font style='color:red;'>"+mesg+"</font></div>");
	$(".error_tips").animate({top:'10px'},200);//展示地方
	//下拉显示提示信息div
	$(".error_tips").slideDown("fast",function(){
		$(".error_tips").show();
	 });
	//定时进行向上收起提示信息div
	setTimeout(function(){
		$(".error_tips").slideUp("fast",function(){
			$(".error_tips").hide();
			$(".error_tips").remove();
		 });
	},2000);//2秒
}

//定义类似java的map
function Map(){
	this.container = new Object();
}

Map.prototype.put = function(key, value){
	this.container[key] = value;
}

Map.prototype.get = function(key){
	return this.container[key];
}

Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		keyset[count] = key;
		count++;
	}
	return keyset;
}

Map.prototype.size = function() {
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend'){
			continue;
		}
		count++;
	}
	return count;
}

Map.prototype.remove = function(key) {
	delete this.container[key];
}
