package com.byron.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;



import com.byron.entity.FinanceLiveRoom;



public interface FinanceLiveRoomMapper {

	FinanceLiveRoom getFinanceLiveRoomById(@Param("roomId") Integer roomId);

}
