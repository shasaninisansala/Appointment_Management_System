package com.example.doctor.controller;

import com.example.doctor.data.Doctor;
import com.example.doctor.service.DoctorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;
@RequestMapping("/doctors")  // This makes all paths start with /doctors
@CrossOrigin(origins = "http://localhost:3000")  // Allow React frontend
@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // GET all doctors
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }



    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable int id) {
        Doctor doctor = doctorService.getDoctorById(id);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctor);
    }
    // POST new doctor
    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }

    // PUT update doctor
    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable int id, @RequestBody Doctor doctor) {
        doctor.setId(id); // set the ID from path
        return doctorService.updateDoctor(doctor);
    }

    // DELETE doctor
    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable int id) {
        doctorService.deleteDoctor(id);
        return "Doctor with ID " + id + " has been deleted.";
    }

    // GET search doctors by keyword
    @GetMapping("/search")
    public List<Doctor> searchDoctors(@RequestParam("q") String keyword) {
        return doctorService.searchDoctors(keyword);
    }

    // GET distinct specializations
    @GetMapping("/specializations")
    public List<String> getSpecializations() {
        return doctorService.getDistinctSpecializations();
    }

    // GET doctors by specialization
    @GetMapping("/by-specialization/{specialization}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable String specialization) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }

    // GET available days for a doctor by ID
    @GetMapping("/{id}/available-days")
    public ResponseEntity<String> getAvailableDays(@PathVariable int id) {
        String availableDays = doctorService.getAvailableDaysByDoctorId(id);
        if (availableDays == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(availableDays);
    }

    // GET time slots for a doctor by ID
    @GetMapping("/{id}/time-slots")
    public ResponseEntity<String> getTimeSlots(@PathVariable int id) {
        String timeSlots = doctorService.getTimeSlotsByDoctorId(id);
        if (timeSlots == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(timeSlots);
    }

}
