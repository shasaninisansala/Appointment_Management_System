package com.example.appointment.controller;

import com.example.appointment.data.Appointment;

import com.example.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/appointments")
public class AppointmentController {



    @Autowired
    private AppointmentService appointmentService;

    // POST: Create a new appointment
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable int id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Update Appointment by ID
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable int id, @RequestBody Appointment updated) {
        Appointment appointment = appointmentService.updateAppointment(id, updated);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete Appointment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable int id) {
        boolean deleted = appointmentService.deleteAppointmentById(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: Booked time slots for doctor and date
    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getBookedSlots(
            @RequestParam int doctorId,
            @RequestParam String date) {
        List<String> booked = appointmentService.getBookedSlotsByDoctorAndDate(doctorId, date);
        return ResponseEntity.ok(booked);
    }


    @GetMapping("/next-app-number")
    public ResponseEntity<Integer> getNextAppNumber(
            @RequestParam int doctorId,
            @RequestParam String date) {
        try {
            LocalDate appDate = LocalDate.parse(date);
            int nextNumber = appointmentService.getNextAppNumber(doctorId, appDate);
            return ResponseEntity.ok(nextNumber);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/appointments/available-time-slots")
    public List<String> getAvailableTimeSlots(
            @RequestParam int doctorId,
            @RequestParam String date) {

        LocalDate appDate = LocalDate.parse(date);
        return appointmentService.getAvailableTimeSlots(doctorId, appDate);
    }

    // GET: Filter appointments by optional doctorId and date
    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) Integer doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<Appointment> appointments = appointmentService.getAppointmentsFiltered(doctorId, date);
        return ResponseEntity.ok(appointments);
    }







}
