package com.byron.controller;

import javax.xml.ws.soap.Addressing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.byron.entity.FinanceLiveRoom;
import com.byron.service.FinanceLiveRoomService;



@RestController
@RequestMapping("FinanceLiveRoom/*")
public class FinanceLiveRoomController {
	
	@Autowired
	private FinanceLiveRoomService financeLiveRoomService;
	
	
	@RequestMapping("{roomId}")
	public FinanceLiveRoom getFinanceLiveRoomById(@PathVariable("roomId") Integer roomId){
		
		return financeLiveRoomService.getFinanceLiveRoomById(roomId);
		
	}

     
}
