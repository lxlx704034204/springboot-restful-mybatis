package com.byron.aspect;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 
* @ClassName: HttpAspect
* @Description: AOP的使用方法
* @author zongyu
* @date 2017年8月11日 下午2:13:50
*
 */

//@AspectJ的方式来实现AOP
@Aspect
@Component
public class HttpAspect {
	
	private final static Logger logger = LoggerFactory.getLogger(HttpAspect.class);
	/**
	 * 第一种aop的方式
	 */
	//拦截UserController下面的所有的方法
	//进入UserController中方法前，先调用以下方法(方法名任意)
	/*@Before("execution(public * com.byron.controller.UserController.*(..))" )
    public void log(){	
	  System.out.println("before the method!");
      }
	
	@After("execution(public * com.byron.controller.UserController.*(..))" )
	public void log1(){	
		System.out.println("after the method!");   
	   }*/
	
	
	/**
	 * 第二种aop的方式
	 */
	@Pointcut("execution(public * com.byron.controller.UserController.*(..))" )
	public void testAop(){}
	
	/**
	 * 
	* @Description: 进入controller中方法前，先调用该方法(方法名任意)
	* @Title: doBefore 
	* @param joinPoint void   
	* @author zongyu
	* @throws
	 */
	@Before("testAop()")
	public void doBefore(JoinPoint joinPoint){
		logger.info("before the method!");
		
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		
		//url  (后面的值会自动填充到{}里面)
		logger.info("url={}",request.getRequestURL());
		//method
		logger.info("methodType={}",request.getMethod());
		//ip
		logger.info("ip={}",request.getRemoteAddr());
		//类名
		logger.info("类名={}",joinPoint.getSignature().getDeclaringTypeName());
		//类方法
		logger.info("类方法={}",joinPoint.getSignature().getName());
		//参数
		logger.info("参数={}",joinPoint.getArgs());
	}
	
	
	/**
	 * 
	* @Description: 执行完controller中方法后，调用该方法(方法名任意)
	* @Title: log3  void   
	* @author zongyu
	* @throws
	 */
	@After("testAop()")
	public void log3(){
		logger.info("after the method!");
	}
	
	/**
	 * 
	* @Description: 方法执行完获取返回结果，执行完@After方法后，调用该方法(方法名任意)
	* @Title: doAfterReturning 
	* @param object void   (对应 returning="object",)
	* @author zongyu
	* @throws
	 */
	@AfterReturning(returning="object",pointcut="testAop()")
    public void doAfterReturning(Object object){
		logger.info("returning!");
    	logger.info("returning={}",object.toString());
    }
	
	
	

}
