package com.example.doctor.service;

import com.example.doctor.data.Doctor;
import com.example.doctor.data.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository docRepo;

    public List<Doctor> getAllDoctors() {
        return docRepo.findAll();
    }

    public Doctor getDoctorById(int id) {
        Optional<Doctor> doc = docRepo.findById(id);
        if (doc.isPresent()) {
            return doc.get();
        }
        return null;
    }

    public Doctor createDoctor(Doctor doctor) {
        return docRepo.save(doctor);
    }

    public Doctor updateDoctor(Doctor doctor) {
        return docRepo.save(doctor); // will update if ID exists
    }

    public void deleteDoctor(int id) {
        docRepo.deleteById(id);
    }

    public List<Doctor> searchDoctors(String keyword) {
        return docRepo.searchByKeyword(keyword);
    }



    public List<String> getDistinctSpecializations() {
        return docRepo.findDistinctSpecializations();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return docRepo.findBySpecialization(specialization);
    }

    public String getAvailableDaysByDoctorId(int doctorId) {
        Doctor doctor = getDoctorById(doctorId);
        if (doctor != null) {
            return doctor.getAvailableDays();
        }
        return null;
    }


    public String getTimeSlotsByDoctorId(int doctorId) {
        Doctor doctor = getDoctorById(doctorId);
        if (doctor != null) {
            return doctor.getTimeSlots();
        }
        return null;
    }

}
