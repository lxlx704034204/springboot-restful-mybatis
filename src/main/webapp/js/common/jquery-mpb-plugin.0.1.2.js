;
//jqgrid plugin config
 (function($) {
    $.fn.mpbGrid = function(queryForm, config,currentPage) {
        $(this).jqGrid("clearGridData");
       	if(currentPage==undefined){
       		currentPage=1;
       	}
        var def = {
            height: "100%",
            url: $.mpbGetHeaderPath() + "/page",
            page: 1,
            rowNum: 10,
            rowList: [10,20,30,100,500, 1000],
            rowTotal: null,
            records: 0,
            datatype: "json",
            mtype: "POST",
            pager: "#pager",
            autowidth: true,
            multiselect: true,
            viewrecords: true,
            shrinkToFit: true,
            forceFit:true,
			postData : {
				"_method" : "GET",
				"queryParams" : function(){
        			return 	queryForm.buildQueryParams();
        		},
        		"mpbClass" : function(){
        			return queryForm.attr("queryclass");
        		}
			}
        };
        config = $.extend(true, def, config);
      	$(this).jqGrid(config).jqGrid("setGridParam", {
            url: config.url,
            page:currentPage
        }).trigger("reloadGrid");
      	return $(this);
    };
 	$.fn.buildQueryParams = function(){
 		  var queryParams="";
    	  queryParams = "{\"queryClass\":\""+$(this).attr("queryClass")+"\",\"param\":[";
    	  $(this).find("[op]").each(function(i){
		  var value = $(this).val();
		  if(value!=""){
			queryParams =queryParams+ "{\"name\":\""+$(this).attr("name")+"\",\"op\":\""+$(this).attr("op")+"\",\"value\":\""+value+"\"},";
		  }
		 });
    	 queryParams = queryParams+"]}";
    	 if(queryParams.indexOf("},]")!=-1){
    		var index = queryParams.indexOf("},]");
    		queryParams = queryParams.substring(0,index+1)+queryParams.substring(index+2);
    	 }
    	 return queryParams;
	   };
	   $.fn.mpbRemove = function(config){
			var ids = $(this).mpbGetCheckAll();
			if(ids==null) {
				return;
			}
			var def={
					"url" : "/delete",
					"idList" : ids.toString(),
					"mpbClass" : $(this).attr("queryclass"),
					"_method":"DELETE"
					};
			config = $.extend(true, def, config);
			var callback = config.callback;
			delete config["callback"];
			if (ids.length > 0) {
				$.mpbQuestion("removeQuestion","确定要删除所选内容吗?",function(yes){
						$.mpbPost(config.url,config,function(data){
							if(data.indexOf("success")!=-1) {
								callback();
								$.mpbTips({content : "删除成功"});
							}else{
								$.mpbTips({icon : "error",content : "删除失败"});
							}
						});
					});
			} 
	   };
	   $.fn.mpbGetCheckOne = function(){
			var ids = $(this).mpbGetCheckAll();
			if(ids==null) {
				return;
			}
			if (ids.length > 1) {
				$.mpbTips({icon : "warning",content : "最多只能选择一条数据!"});
			} else {
				return ids[0];
			}
	   };
	   $.fn.mpbGetCheckAll = function(){
			var id = $(this).jqGrid('getGridParam', 'selarrrow');
			var ids = [];
			if (null != id && id.toString() != "") {
				ids = id.toString().split(",");
			}
			if (ids.length > 0) {
				return ids;
			}else{
				$.mpbTips({icon : "warning",content : "请至少选择一条数据!"});
				return null;
			}
	   };
	   //ajaxsubmit
	   $.fn.mpbAjaxSubmit =  function(config){
		   var form = $(this);
		   var _method = $(form).find("#_method").val();
		   var u = "/save";
		   if(_method.toUpperCase()=="PUT"){
			   u = "/update";
		   }
		   var def = {
				type : "post",
				dataType : "json" 
		   };
		   config = $.extend(true,def,config);
		   if($.isNotBlank(config.url)){
			   u = config.url;
			   delete config.url;
		   }
		   $(form).append('<input type="hidden" id="mpbClass" name="mpbClass" value="'+$(form).attr("queryclass")+'" />');
		   form.attr("action", $.mpbGetHeaderPath()+u);
		   config.error = function(responseText, statusText, xhr, $form){
			   if(xhr=="Forbidden"){
				   //权限不足
				   top.location = $.mpbGetHeaderPath()+"/403.html";;
			   }
		   };
		   
		   config.beforeSubmit = function(arr, $form, options){
//			   $("body").append("<div class=\"cover_div\"></div>");
//			   $(".cover_div").height($(window).height());
			   $(window).resize(function(){
//			   	$(".cover_div").height($(window).height());
			   });
		   };
		   form.ajaxSubmit(config);
		};
})(jQuery);

 
//artDiglog
$.mpbAlert = function(opts,callback) {
	    var def = {
	    	title : "温馨提示",
	    	content : "",
	    	icon : "succeed",
	    	ok: function(){
	    	  if(callback!=undefined && callback!=null){
	    		callback();
	    	  }
	    	},
	    	id:"message"
	    };
	   opts = $.extend(true,def,opts);
	   art.dialog(opts);
	   if(opts.icon=="succeed"){
		   setTimeout(function(){
				$("body").find(".cover_div").remove();
				artDialog.get(opts.id)._click("确定");
		   },500);
	   }
};

//artDiglog
$.mpbTips = function(opts,callback) {
   art.dialog.tips(opts);
   if($.isNotBlank(callback)){
	   callback();
   }
};


$.mpbOpen = function(url, opts) {
    var def = {
    	 	title: "",
            id: "",
            width: 800,
            height: 400
    };
    opts = $.extend(true,def,opts);
    var opparams = opts.params;
    if(opparams !="" && opparams!=null && opparams != undefined) {
    	url = url +"?";
    	for(var key in opparams) {
    		url = url+key+"="+$.encode(opts.params[key])+"&";
    	}
    }
    if(opts.id !="" &&  art.dialog.list[opts.id] != null && art.dialog.list[opts.id] != "" && art.dialog.list[opts.id] != undefined) {
    	$("body").find(".cover_div").remove();
    	  art.dialog.list[opts.id].close();
    }
    if(url.indexOf("?")!=-1){
    	url = url.substring(0,url.length-1);
    }
    url = $.mpbGetHeaderPath()+url;
    return art.dialog.open(url, opts);
};

$.mpbClose = function(method,params) {
	$("body").find(".cover_div").remove();
	if (method == "" || method == null || method == undefined) {
        art.dialog.close();
        return;
    }
    var win = art.dialog.open.origin; // 来源页面
    if(params !="" && params != null && params !=undefined) {
//    	var param = "";
//    	for(var key in params){
//    		param = param+"\""+params[key].toString()+"\",";
//    	}
//    	param = param.substring(0,param.length-1).replaceAll("\n", "");
    	win.eval(method + "("+params+")");
    }else{
    	win.eval(method + "()");
    }
    art.dialog.close();
	return;
};

$.mpbQuestion = function (id,message,callback) {
	art.dialog({
            content: message,
            title: "温馨提示",
            icon: "question",
            ok: callback,
            cancelVal: '取消',
            cancel: true,
            id: id
    });
};

var defaultWidth = 0;
var state = "small";
$.resizeTable = function(document,defop) {
	if($(document)==null || $(document).find(".ui-jqgrid").get(0)=="undefined" || $(document).find(".ui-jqgrid").get(0)==undefined){
		return;
	}
	var id = $(document).find(".ui-jqgrid").get(0).id.split("_")[1];
	if(defaultWidth==0) {
		defaultWidth = $(document.getElementById(id)).width();
	}
	if((defop == "layout" && state!="big") || (defop=="tab" && state!="small")){
		state = "big";
	}else{
		state = "small";
	}
	if(state == "big"){
		nwidth =$($(document).find(".buttons_box").get(0)).width()-30;
	}else{
		nwidth = defaultWidth;
	}
	$(document.getElementById(id)).css("width",nwidth+"px");
	$(document.getElementById("gbox_"+id)).css("width",nwidth+"px");
	$(document.getElementById("gview_"+id)).css("width",nwidth+"px");
	$(document).find(".ui-jqgrid-hdiv").each(function(){
		$(this).css("width",nwidth+"px");
	});
	$(document).find(".ui-jqgrid-bdiv").each(function(){
		$(this).css("width",nwidth+"px");
	});
	$(document).find(".ui-jqgrid-pager").each(function(){
		$(this).css("width",nwidth+"px");
	});
	var tempArray = new Array();
	$($($(document).find(".jqgfirstrow").get(0)).find("td")).each(function(i){
		tempArray[i]= $(this).width();
	});
	$(document).find("[role=columnheader]").each(function(i){
		$(this).css("width",tempArray[i]);
	});
};

(function($) {
	// ztree开始部分
	var _ztree;
	//param里的参数，id：隐藏的传值，name：显示的值，pid：父ID，baseNode：根节点的名称，title：鼠标放上浮出的显示信息
	$.fn.mpbZTree = function(url,param,setting,callback) { 
		var defName = $(this);
		var nodes = [];
		defName.empty();
		var defParam = {
				id : "id",
				name : "name",
				pid : "pid",
				title : "name",
				url:"value",
				ids:""
		};
		param = $.extend(true,defParam,param);
		var ids = ","+param.ids+",";
		var defaultSetting = {
			view : {
				showTitle : true
			},
			check : {
				enable : true
			},
			data : {
				key : {
					title : "title"
				},
				simpleData : {
					enable : true
				}
			}
		};

		setting = $.extend(true, defaultSetting, setting);
		if(param.baseNode!=undefined){
			nodes.push({
				id : "",
				name : param.baseNode,
				title : param.baseNode, 
				open : true, noR:true
			});
		}
		$.post($.mpbGetHeaderPath() + url, {
			"_method" : "GET"
		}, function(data) {
			if (data != null) {
				$.each(data, function(i, item) {
					if (item != null && item != '') {
						var n;
						var pid = "";
						if (item[param.pid] != null
								&& item[param.pid] != "undefined") {
							pid = item[param.pid];
						}
						var checked = false;
						if (ids.indexOf(
									"," + item.id + ",") != -1) {
							checked = true;
						}
						var url ="";
						if(item[param.url]!=undefined){
							url = item[param.url];
						}
						n = {
							id : item[param.id],
							pId : pid,
							name : item[param.name],
							title : item[param.title],
							resUrl : url,
							checked : checked
						};
						nodes.push(n);
					}
				});
			}
			_zTree = $.fn.zTree.init(defName, setting, nodes);
			if(callback!=undefined && callback!=null){
				callback(_zTree);
			}
		}, "json");
	};
	// ztree 结束部分
})(jQuery);


//echarts   start
(function($) {
	 //封装Echarts，后台封装，前台不可修改任何有关echarts的东西，如有个性化需求，请使用下面的 mpbNativeEcharts
	/**
	 * params.eConfig 是前台js，用来传echarts相关options的东西，覆盖本方法默认参数。
	 * params.ajaxData 传递到后台的参数项
	 * params.ajaxData{"_method" : "GET"} 为请求方式
	 * params.callback 回调函数
	 * return 返回echarts对象
	 */
	   $.fn.mpbEcharts = function(params){
		   //echarts 相关参数赋值
		   var div = $(this);
	        // 基于准备好的dom，初始化echarts图表
	        var myChart = echarts.init(document.getElementById(div.attr("id"))); 
		// 过渡---------------------
		   myChart.showLoading({
		       text: '正在努力的加载数据中...'    //loading话术
		   });

		   //ajax获取数据
		   //_data为展示数据 , _result为返回的数据
		   var xAxisData = [], text = "" , subtext = "" , legendData = [],splitNumber=10,_typeSeries="line",seriesData = [];
		   //第二个参数params主要用于请求相关配置如果不为空则进入，与echarts js 插件本身无关
		   //ajaxData 会覆盖ajax请求里面的data
		   var defParam = {
			   ajaxData : {
				   "_method" : "GET"
			   }
		   };
		   params = $.extend(true,defParam,params);//外部参数覆盖默认参数
		   config = params.eConfig;
		   //ajax 请求获得数据，此处的ajax请求是同步请求
		   $.mpbAjax(params.url, {
			   data: params.ajaxData,
			   async : false,//为false指同步
			   success : function(data){
				   //请求成功之后的数据赋值操作
				   if($.isNotBlank(data)){
					   var _dataRresult = data;
					   if($.isNotBlank(data.state)){
						   _dataRresult = data.data.result;
					   }
					   xAxisData = _dataRresult.xAxis;
					   if($.isNotBlank(data.specificDatas) && _dataRresult.specificDatas.length>0){
						   var specifics = _dataRresult.specificDatas;
						   for(var i=0;i<specifics.length;i++){
							   var _data = specifics[i].data;
							   var name = specifics[i].name;
							   //图形显示方式,line 折线图，bar柱状图。。。（默认为line）
							   if($.isNotBlank(specifics[i].type)){
								   _typeSeries = specifics[i].type;
							   }
							   if($.isNotBlank(name)){
								   legendData.push(name);
							   }else{
								   name = '数据';
							   }
							   seriesData.push({
						            name : name,
						            smooth:true,
						            type : _typeSeries,
						            data : _data//此处的data就是画图的数据
						        });
						   }
					   }else{
						   $.mpbTips({content : "该时段暂无数据"});
					   }
					   // ajax callback
					   myChart.hideLoading();
				   }
				   //回调函数
				   if($.isNotBlank(params.callback)){
					   params.callback(data);
				   }
			   }
		   });
		   
		   
		   
		   var def = {

				    legend: {                                   // 图例配置
				        padding: 5,                             // 图例内边距，单位px，默认上下左右内边距为5
				        itemGap: 10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				        data: legendData,
						x:'right',//图例位置  右上
						y:'top'//图例位置  右上
				    },
				    tooltip: {                                  // 气泡提示配置
				        trigger : 'axis'						// 触发类型，默认数据触发，可选为：'axis'
				    },
				    xAxis: [                                    // 直角坐标系中横轴数组
				        {
				            type: 'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
				            data: xAxisData,
							axisLine:false,
							axisTick:false,
							splitLine:{
								show:true,
								lineStyle:{
									color: ['#eee'], 
									width: 1, 
									type: 'dashed'
									}
								},
							axisLabel:{
							textStyle:{color: '#bbb'}
								}
				        }
				    ],
				    yAxis: [                                    // 直角坐标系中纵轴数组
				        {
				            type: 'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
				            boundaryGap: [0.1, 0.1],            // 坐标轴两端空白策略，数组内数值代表百分比
				            splitNumber: 4,                      // 数值轴用，分割段数，默认为5
							splitLine:{
								show:true,
								lineStyle:{
								color: ['#eee'], 
								width: 1, 
								type: 'dashed'
									}
								},
							axisLabel:{
								textStyle:{color: '#bbb'}
								},
							axisLine:false,
							axisTick:false
				       		 }
				    ],
				    series: seriesData,
					grid:{
						x:30,
						x2:0,
						y:30,
						y2:30,
						borderWidth:0
						},
					dataZoom:{//数据区域缩放
						show:true,//是否显示
						height:30,//bar的高度
						backgroundColor: 'rgba(135,206,250,0.1)',
						dataBackgroundColor:'rgba(135,206,250,0.2)',
						fillerColor:'rgba(135,206,250,0.1)',
						handleColor:'rgba(88,190,242,1)',
						//zoomLock:true,
						y:365
						}
					
				};
		   
		   

		   
//		   var def = {
//			    tooltip : {
//			        trigger : 'axis'
//			    },
//			    legend: {
//			        data : legendData
//			    },
//			    calculable : false,
//			    xAxis : [
//					        {
//					        	splitLine : true,
//					            type : 'category',
//					            boundaryGap : false,
//					            axisTick : {
//					            	show : true
//					            },
//					            data : xAxisData
//					        }
//					    ],
//			    yAxis : [
//			        {
//			        	splitLine : true,
//			            type : 'value',
//			            splitNumber: 10,
//			            axisLabel : {
//			                formatter: '{value}'
//			            }
//			        }
//			    ],
//			    series : seriesData
//		   };
		   config = $.extend(true,def,config);//外部参数覆盖默认参数
		   // 为echarts对象加载数据
	        myChart.setOption(config); 
	        return myChart;
	   };

//echarts   end
	   
   //封装NativeEcharts ，原生版的，在不影响其结构的情况下可以按它的方式传参来实现其个性化需求
   /**
    * return 返回Echarts对象
    */
   $.fn.mpbNativeEcharts = function(config,params){
	   //ajax获取数据
	   //_data为展示数据 , _result为返回的数据
	   var _data = [],_xAxis=[];
	   //第二个参数params主要用于请求相关配置如果不为空则进入，与echarts js 插件本身无关
	   /*
	    * 第二个参数相关参数的配置，isShowField  显示的数据列，isXaxisField   显示的x轴数据。
	    */
	   if($.isNotBlank(params)){
		   //ajaxData 会覆盖ajax请求里面的data
		   var defParam = {
			   url : "/queryEcharts",
			   isShowField : "name",//显示字段，会根据该字段画图
			   isXaxisField : "z0030",
			   postData : {
				   "_method" : "GET",
				   "mpbClass" : function(){
					   return $("#"+params.id).attr("queryclass");
				   },
				   "queryParams" : function(){
					   return $("#"+params.id).buildQueryParams();
				   }
			   }
		   };
		   params = $.extend(true,defParam,params);//外部参数覆盖默认参数
		   //ajax 请求获得数据，此处的ajax请求是同步请求
		   $.mpbAjax(params.url, {
			   data: params.ajaxData,
			   async : false,//为false指同步
			   success : function(data){
				   //请求成功之后的数据赋值操作
				   if($.isNotBlank(data)){
					   for(var i=0;i<data.length;i++){
						   _data.push(data[i][params.isShowField]);
						   _xAxis.push(data[i][params.isXaxisField]);
					   }
				   }
				   //回调函数
				   if($.isNotBlank(params.callback)){
					   params.callback(data);
				   }
			   }
		   });
	   }
	   //echarts 相关参数赋值
	   var div = $(this);
	   var def = {
		    tooltip : {
		        trigger: 'axis'
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : false,
		    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : _xAxis
				        }
				    ],
		    yAxis : [
		        {
		            type : 'value',
		            splitNumber: 10,
		            axisLabel : {
		                formatter: '{value}'
		            }
		        }
		    ],
		    series : [
		        {
		            name:'最大',
		            type:'line',
		            smooth:true,
		            data:_data,//此处的data就是画图的数据
		            markPoint : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
	   };
	   config = $.extend(true,def,config);//外部参数覆盖默认参数
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById(div.attr("id"))); 
	   // 为echarts对象加载数据
        myChart.setOption(config); 
        return myChart;
   };

 //Native  Echarts   end
})(jQuery);


//图片上传
(jQuery);(function($){
	$.fn.mpbFileUpload=function(config){
		var def = {
			 url:$.mpbGetHeaderPath()+"/fileDoc/upload"
	        };
		url=config.url,e=!1;
	/*	var url=$.mpbGetHeaderPath()+"/fileDoc/upload",e=!1;*/
        config = $.extend(true, def, config);
		$.browser.msie&&10>$.browser.version&&(e=!0);
		return $("#" + config.operateId).fileupload({
					url:config.url,
					iframe:e,
					dataType:"json",
					autoUpload:!0,
					formData:{docId:config.docId,proId:config.proId,id:config.id,valueType:config.valueType},
					add:function(d,c){
						c.submit()
					},
					done:function(h,g){
						$.isNotBlank(config.callback)&&config.callback(g.result)
					}}).on("fileuploadprogressall",function(g,i){
							$("#progress").show();
							var h=parseInt(i.loaded/i.total*100,10);
							$("#progress .progress-bar").css("width",h+"%")}).on("fileuploadfail",function(h,g){
								$.isNotBlank(config.callback)&&config.callback(config.docId)
	})};
	
$.mpbBuildDownloadTb=function(config){
	var def={
	downCheck:!0,downOne:!0,
	delCheck:!0,delOne:!0};
	config=$.extend(def,config);
	$.mpbAjax(
		"/fileDoc/get/"+config.docId,
		{
			data : {
				_method:"GET"
			},
			async : false,
			success : function(data) {
				$("#progress").hide();
				$("#progress .progress-bar").css("width","0%");
				if($.isNotBlank(data)&&0<data.length){
					var cont = $("#" + config.cont);
					cont.empty();
					for(var i=0;i<data.length;i++){
						cont.append("<li>" +
				                   "<dl class='xganniu'>" +
				                   "<dt><img src='" + $.mpbGetHeaderPath() + data[i].path + "'></dt>" +
				                   "<dd><input type='hidden' name='fileIds' value='" + data[i].id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
				                   "</dl></li>")
					}
				}
			}
		}
	);
	}

$.mpbLoadSingleFile=function(config){
	var getHeaderPath= $.mpbGetHeaderPath().substr("0","21");
	var def = {};
	config = $.extend(def,config);
	$.mpbAjax(
			"/fileDoc/get",
			{
				data : {
					_method:"GET",
					id : config.id
				},
				async : false,
				success : function(data) {
					$("#progress").hide();
					$("#progress .progress-bar").css("width","0%");
					if($.isNotBlank(data)){
						var cont = $("#" + config.cont);
						if(config.isSimple == "true") {
							cont.empty();//清空
						}
						cont.append("<li>" +
		                   "<dl class='xganniu'>" +
		                   "<dt><img src='" + getHeaderPath + data.path + "'></dt>" +
		                   "<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
		                   "</dl></li>")
					}
				}
			}
		);
}
$.mpbLoadSingleFile_admin=function(config){
	var def = {
			url:"/fileDoc/get",
	};
	config = $.extend(def,config);
	$.mpbAjax(
			config.url,
			{
				data : {
					_method:"GET",
					id : config.id
				},
				async : false,
				success : function(data) {
					$("#progress").hide();
					$("#progress .progress-bar").css("width","0%");
					if($.isNotBlank(data)){
						var cont = $("#" + config.cont);
						if(config.isSimple == "true") {
							cont.empty();//清空
						}
						
						cont.append("<li>" +
		                   "<dl class='xganniu'>" +
		                   "<dt><img src='" + data.path + "'></dt>" +
		                   "<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
		                   "<input type='hidden' id='"+config.inputName+"' name='"+config.inputName+"' value='"+ data.path+"' imgId='"+data.id+"'/>"+
		                   "</dl></li>")
					}
				}
			}
		);
}

$.mpbLoadSingleFile_config=function(config){
	var def = {
			url:"/fileDoc/get",
	};
	config = $.extend(def,config);
	$.mpbAjax(
			config.url,
			{
				data : {
					_method:"GET",
					id : config.id
				},
				async : false,
				success : function(data) {
					$("#progress").hide();
					$("#progress .progress-bar").css("width","0%");
					if($.isNotBlank(data)){
						var cont = $("#" + config.cont);
						if(config.isSimple == "true") {
							cont.empty();//清空
						}
						if(config.cont=="cover1"){
							cont.append("<li>" +
									"<dl class='xganniu'>" +
									"<dt><img src='" + data.value + "'></dt>" +
									"<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
									"<input type='hidden' id='"+config.inputName+"' name='"+config.inputName+"' value='"+ data.value+"' imgId='"+data.id+"'/>"+
							"</dl></li>")
						}else{
							cont.append("<li>" +
									"<dl class='xganniu'>" +
									"<dt><img src='" + data.value2 + "'></dt>" +
									"<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
									"<input type='hidden' id='"+config.inputName+"' name='"+config.inputName+"' value='"+ data.value2+"' imgId='"+data.id+"'/>"+
							"</dl></li>")
						}
					}
				}
			}
		);
}
//回显图片
$.mpbLoadSingleFile_config_all=function(config){
	var def = {
			url:"/fileDoc/get",
	};
	config = $.extend(def,config);
	$.mpbAjax(
			config.url,
			{
				data : {
					_method:"GET",
					id : config.id
				},
				async : false,
				success : function(data) {
					$("#progress").hide();
					$("#progress .progress-bar").css("width","0%");
					if($.isNotBlank(data)){
						var cont = $("#" + config.cont);
						if(config.isSimple == "true") {
							 $("#cover1").empty();//清空
							 $("#cover2").empty();//清空
						}
						 $("#cover1").append("<li>" +
									"<dl class='xganniu'>" +
									"<dt><img src='" + data.value + "'></dt>" +
									"<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
									"<input type='hidden' id='"+config.inputName+"' name='"+config.inputName+"' value='"+ data.value+"' imgId='"+data.id+"'/>"+
							"</dl></li>")
					    $("#cover2").append("<li>" +
									"<dl class='xganniu'>" +
									"<dt><img src='" + data.value2 + "'></dt>" +
									"<dd><input type='hidden' name='fileIds' value='" + data.id + "' /><a onclick='_remove(this);'>删除</a></dd>" +
									"<input type='hidden' id='"+config.inputName+"' name='"+config.inputName+"' value='"+ data.value2+"' imgId='"+data.id+"'/>"+
							"</dl></li>")
					}
				}
			}
		);
}


//下载
$.mpbDownload=function(b){
	window.parent.window.open($.mpbGetHeaderPath()+"/fileDoc/down/"+b)
}
})(jQuery);

//简历头像专用
$.mpbBuildDownloadTbForHeadpic=function(config){
	var def={
	downCheck:!0,downOne:!0,
	delCheck:!0,delOne:!0};
	config=$.extend(def,config);
	$.mpbAjax(
		"/fileDoc/get/"+config.docId,
		{
			data : {
				_method:"GET"
			},
			async : false,
			success : function(data) {
				$("#progress").hide();
				$("#progress .progress-bar").css("width","0%");
				if($.isNotBlank(data)&&0<data.length){
					var cont = $("#" + config.cont);
					cont.empty();
					for(var i=0;i<data.length;i++){
						cont.append("<li>" +
				                   "<dl class='xganniu'>" +
				                   "<dt><img src='" + $.mpbGetHeaderPath() + data[i].path + "'></dt>" +
				                   "<dd><input type='hidden' name='fileIds' value='" + data[i].id + "' /></dd>" +
				                   "</dl></li>")
					}
				}
			}
		}
	);
	}

