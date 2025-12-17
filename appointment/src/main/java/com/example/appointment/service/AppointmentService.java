package com.example.appointment.service;


import com.example.appointment.data.Appointment;
import com.example.appointment.data.AppointmentRepository;
import com.example.appointment.data.Doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {



    @Autowired
    private AppointmentRepository appointmentRepository;
    private RestTemplate restTemplate = new RestTemplate();
    private final String doctorServiceUrl = "http://localhost:8085/doctors";  // Doctor microservice base URL

    // Create appointment
    public Appointment createAppointment(Appointment appointment) {
        LocalDate date = appointment.getAppDate();
        int doctorId = appointment.getDoctorId();

        // Get max appNumber for this doctor on this date
        Integer maxAppNumber = appointmentRepository.findMaxAppNumberByDateAndDoctor(date, doctorId);
        if (maxAppNumber == null) {
            maxAppNumber = 0;
        }

        // Set next appointment number
        appointment.setAppNumber(maxAppNumber + 1);

        return appointmentRepository.save(appointment);
    }

    //  Get by ID
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    // Update
    public Appointment updateAppointment(int id, Appointment updatedAppointment) {
        Optional<Appointment> optional = appointmentRepository.findById(id);
        if (optional.isPresent()) {
            Appointment existing = optional.get();

            existing.setPatientName(updatedAppointment.getPatientName());
            existing.setPatientContact(updatedAppointment.getPatientContact());
            existing.setAppDate(updatedAppointment.getAppDate());
            existing.setAppTime(updatedAppointment.getAppTime());
            existing.setAppFee(updatedAppointment.getAppFee());
            existing.setAppNumber(updatedAppointment.getAppNumber());
            existing.setDoctorId(updatedAppointment.getDoctorId());
            existing.setStatus(updatedAppointment.getStatus());

            return appointmentRepository.save(existing);
        } else {
            return null;
        }
    }

    //  Delete
    public boolean deleteAppointmentById(int id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Get appointments by doctor & date (for booked slots)
//    public List<Appointment> getAppointmentsByDoctorAndDate(int doctorId, LocalDate appDate) {
//        return appointmentRepository.findByDoctorIdAndAppDate(doctorId, appDate);
//    }





    public List<String> getBookedSlotsByDoctorAndDate(int doctorId, String date) {
        LocalDate localDate = LocalDate.parse(date); // Converts "YYYY-MM-DD" to LocalDate
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndAppDate(doctorId, localDate);

        return appointments.stream()
                .map(Appointment::getAppTime) // assuming appTime is a String like "9:00 AM"
                .collect(Collectors.toList());
    }

    public List<String> getAvailableTimeSlots(int doctorId, LocalDate date) {
        // Call Doctor microservice to get time slots
        String url = doctorServiceUrl + "/" + doctorId + "/time-slots";
        String timeSlotsString = restTemplate.getForObject(url, String.class);

        if (timeSlotsString == null || timeSlotsString.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> allSlots = Arrays.asList(timeSlotsString.split(","));

        // Fetch booked appointments from Appointment DB
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppDate(doctorId, date);
        List<String> bookedSlots = bookedAppointments.stream()
                .map(Appointment::getAppTime)
                .collect(Collectors.toList());


        // Filter out booked slots
        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    public int getNextAppNumber(int doctorId, LocalDate appDate) {
        int maxNumber = appointmentRepository.findMaxAppNumberByDoctorIdAndAppDate(doctorId, appDate);
        if (maxNumber >= 20) {
            throw new RuntimeException("Maximum appointments reached for the day");
        }
        return maxNumber + 1;
    }

    public List<Appointment> getAppointmentsFiltered(Integer doctorId, LocalDate date) {
        if (doctorId != null && date != null) {
            return appointmentRepository.findByDoctorIdAndAppDate(doctorId, date);
        } else if (doctorId != null) {
            return appointmentRepository.findByDoctorId(doctorId);
        } else if (date != null) {
            return appointmentRepository.findByAppDate(date);
        } else {
            return appointmentRepository.findAll();
        }
    }


}

