package com.byron.service;

import com.byron.entity.User;

public interface UserService {

	/**
	 * 
	* @Description: 根据id查询用户信息 
	* @Title: selectByPrimaryKey 
	* @param id
	* @return User   
	* @author zongyu
	* @throws
	 */
	User selectByPrimaryKey(Integer id);

	
	
	/**
	 * 
	* @Description: 添加用户
	* @Title: insert 
	* @param user
	* @return int   
	* @author zongyu
	* @throws
	 */
	int insert(User user);



	/**
	 * 
	* @Description: 根据Id修改用户信息
	* @Title: updateByPrimaryKey 
	* @param user
	* @return Integer   
	* @author zongyu
	* @throws
	 */
	Integer updateByPrimaryKey(User user);



	void getHeight(Integer id);

}
