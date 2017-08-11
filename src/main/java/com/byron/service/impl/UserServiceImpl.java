package com.byron.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.byron.dao.UserMapper;
import com.byron.entity.User;
import com.byron.service.UserService;


@Service
public class UserServiceImpl implements UserService{
	
	
	@Autowired
	private UserMapper userMapper;

	
	/**
	 * 
	* @Description:根据id查询用户信息
	* @Title: selectByPrimaryKey 
	* @param id
	* @return   
	* @author zongyu
	* @throws
	 */
	@Override
	public User selectByPrimaryKey(Integer id) {
		
		return userMapper.selectByPrimaryKey(id);
	}

	
	
	/**
	 * 
	* @Description: 添加用户
	* @Title: insert 
	* @param user
	* @return   
	* @author zongyu
	* @throws
	 */

	@Override
	public int insert(User user) {
		
		user.setCreateTime(LocalDateTime.now());
		return userMapper.insert(user);
	}



	@Override
	public Integer updateByPrimaryKey(User user) {
		user.setModifyTime(LocalDateTime.now());
		return userMapper.updateByPrimaryKey(user);
	}



	@Override
	public void getHeight(Integer id) {
		User user = selectByPrimaryKey(id);
		Short height = user.getHeight();
		
		if(height>180){
			
		}
		
	}

}
