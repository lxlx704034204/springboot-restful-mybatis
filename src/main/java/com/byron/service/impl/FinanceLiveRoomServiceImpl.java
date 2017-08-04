package com.byron.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.byron.dao.FinanceLiveRoomMapper;
import com.byron.entity.FinanceLiveRoom;
import com.byron.service.FinanceLiveRoomService;


@Service
public class FinanceLiveRoomServiceImpl implements FinanceLiveRoomService{

	@Autowired
	private FinanceLiveRoomMapper financeLiveRoomMapper;

	@Override
	public FinanceLiveRoom getFinanceLiveRoomById(Integer roomId) {
		
		return financeLiveRoomMapper.getFinanceLiveRoomById(roomId);
	}
}
