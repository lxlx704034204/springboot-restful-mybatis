
/**
 * 根据id获取房间信息
 */
function getUserById(){
	
	let url = $.mpbGetHeaderPath()+"/users/1";
	
	var resultPromise = $.ajax({
		url:url,
		data:{},
		dataType:"json",
		type:"get"
		
	});
	
	resultPromise.then(function(data){
		console.info(data);
	});
}

/**
 * 
 */
function addUser(){
	
   let url = $.mpbGetHeaderPath()+"/users"
	
	var resultPromise = $.ajax({
		url:url,
		data:{"firstName":"jim","address":"dfsg","height":180},
		dataType:"json",
		type:"post"
		
		
	})
	
	resultPromise.then(function(data){
		console.info(data);
	});
}


/**
 * 更新房间信息
 */
function updateUser(){
	
let url = $.mpbGetHeaderPath()+"/users";
	
	var resultPromise = $.ajax({
		url:url,
		data:{"id":8,"firstName":"do!","remark":""},
		dataType:"json",
		type:"put"
		
	});
	
	resultPromise.then(function(data){
		console.info(data);
	});
}