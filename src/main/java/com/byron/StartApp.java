package com.byron;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;


//@SpringBootApplication 注解等价于以默认属性使用 @Configuration ， @EnableAutoConfiguration 和 @ComponentScan
@SpringBootApplication
//告诉Spring 哪个packages 的用注解标识的类 会被spring自动扫描并且装入bean容器。
//@ComponentScan(basePackages={"com.byron"})
//mybatis扫描接口映射包
@MapperScan("com.byron.dao")
public class StartApp extends SpringBootServletInitializer  implements EmbeddedServletContainerCustomizer{
	
	
     // 实现SpringBootServletInitializer让spring-boot项目在web容器中运行
     
	/* protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
	        return application.sources(StartApp.class);
	    }*/
	
	public static void main(String[] args){
		SpringApplication.run(StartApp.class,args);
	}

	@Override
	public void customize(ConfigurableEmbeddedServletContainer container) {
		container.setPort(8081);  
	}
	
	

}

