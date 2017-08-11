package com.byron.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.byron.common.Result;
import com.byron.common.ResultUtil;
import com.byron.entity.User;
import com.byron.service.UserService;

/**
 * 
* @ClassName: UserCommonController
* @Description: 采用统一的数据返回格式
* @author zongyu
* @date 2017年8月11日 下午2:34:07
*
 */
@RestController
@RequestMapping("/usersCommon")
public class UserCommonController {
	
	
	@Autowired
	private UserService userService;
	
	/**
	 * 
	* @Description: 根据id查询用户信息
	* @Title: selectByPrimaryKey 
	* @param id
	* @return User   
	* @author zongyu
	* @throws
	 */
	@GetMapping("/{id}")
	public User selectByPrimaryKey(@PathVariable("id") Integer id){

		return userService.selectByPrimaryKey(id);
	}
	
	
	/**
	 * 
	* @Description: 添加用户
	* @Title: insert 
	* @param user
	* @return int   
	* @author zongyu
	* @throws
	 */
	@PostMapping()
	public Result<Integer> insert(@Valid User user,BindingResult bindingResult){
		
		Result<Integer> result = new Result<Integer>();
		
		//校验
		if(bindingResult.hasErrors()){		
		   return ResultUtil.error(0,bindingResult.getFieldError().getDefaultMessage());
		}
		
		return ResultUtil.success(userService.insert(user));
		
		
	}
	
	
	/**
	 * 
	* @Description:根据Id修改用户信息
	* @Title: updateByPrimaryKey 
	* @return Integer   
	* @author zongyu
	* @throws
	 */
	@PutMapping("")
	public Integer updateByPrimaryKey(User user){
		
		return userService.updateByPrimaryKey(user);
		
	}

}
