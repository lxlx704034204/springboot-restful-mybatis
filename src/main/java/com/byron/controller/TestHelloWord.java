package com.byron.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/helloWord/*")
public class TestHelloWord {
	
	@RequestMapping("testHelloWord")
	public String testHelloWord(){
		
		return "success";	
	}
  
}
