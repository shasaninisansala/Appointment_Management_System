package com.room_ms.controller;

import com.room_ms.data.Room;
import com.room_ms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping(path = "/rooms")
    public List<Room> getAllRooms(){
        return roomService.getAllRooms();
    }

    @GetMapping(path = "/rooms/{id}")
    public Room getRoomById(@PathVariable int id){
        return roomService.getRoomById(id);
    }

    @PostMapping(path = "/rooms")
    public Room createRoom(@RequestBody Room room){
        return roomService.createRoom(room);
    }

    @PutMapping(path = "/rooms/{id}")
    public Room updateRoom(@PathVariable int id, @RequestBody Room room) {
        room.setId(id);
        return roomService.updateRoom(room);
    }

    @DeleteMapping(path = "/rooms/{id}")
    public void deleteRoom(@PathVariable int id){
        roomService.deleteById(id);
    }
    @GetMapping(path = "/rooms",params = {"roomType"})
    public List<Room> searchRoomByType(@RequestParam String roomType){
        return roomService.searchRoomByType(roomType);
    }

    @GetMapping(path = "/rooms/doctors/{doctorId}")
    public Room getRoomByDoctorId(@PathVariable int doctorId) {
        return roomService.getRoomByDoctorId(doctorId);
    }

}
