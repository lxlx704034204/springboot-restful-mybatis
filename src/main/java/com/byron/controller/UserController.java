package com.byron.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.byron.entity.User;
import com.byron.service.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	
	
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
	public Integer insert(@Valid User user,BindingResult bindingResult){
		//校验
		if(bindingResult.hasErrors()){
			System.out.println(bindingResult.getFieldError().getDefaultMessage());
		    return null;
		}
		
		return  userService.insert(user);
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
	
	@GetMapping("/getHeight/{id}")
	public void getHeight(@PathVariable("id") Integer id){
		 userService.getHeight(id);
	}

}
