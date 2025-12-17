package com.room_ms.service;

import com.room_ms.data.Room;
import com.room_ms.data.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepo;

    public List<Room> getAllRooms(){
        return roomRepo.findAll();
    }
    public Room getRoomById(int id){
        Optional<Room> room=roomRepo.findById(id);
        if(room.isPresent()){
            return room.get();
        }
        return null;
    }

    public Room createRoom(Room room){
        return roomRepo.save(room);
    }
    public Room updateRoom(Room room) {
        Room existingRoom = roomRepo.findById(room.getId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + room.getId()));

        existingRoom.setDoctorId(room.getDoctorId());
        existingRoom.setRoomNo(room.getRoomNo());
        existingRoom.setRoomType(room.getRoomType());
        existingRoom.setFloor(room.getFloor());
        existingRoom.setStatus(room.getStatus());

        return roomRepo.save(existingRoom);
    }

    public void deleteById(int id){
        roomRepo.deleteById(id);
    }

    public List<Room> searchRoomByType(String roomType){
        return roomRepo.searchRoom(roomType);
    }
    public Room getRoomByDoctorId(int doctorId) {
        return roomRepo.findByDoctorId(doctorId);
    }

}
