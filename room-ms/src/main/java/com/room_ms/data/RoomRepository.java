package com.room_ms.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository <Room,Integer>{
    @Query("select r from Room r where r.roomType=?1")
    public List<Room> searchRoom(String roomType);

    Room findByDoctorId(int doctorId);
}
