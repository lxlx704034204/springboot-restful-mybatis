package com.byron.entity;

public class FinanceLiveRoom {
	
	
	private Integer id;
	private String roomName;
	private String roomDomain;
	private String roomLogo;
	
	private Integer status;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public String getRoomDomain() {
		return roomDomain;
	}
	public void setRoomDomain(String roomDomain) {
		this.roomDomain = roomDomain;
	}
	public String getRoomLogo() {
		return roomLogo;
	}
	public void setRoomLogo(String roomLogo) {
		this.roomLogo = roomLogo;
	}
	

}
