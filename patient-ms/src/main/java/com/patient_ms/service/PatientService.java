package com.patient_ms.service;

import com.patient_ms.data.Patient;
import com.patient_ms.data.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepo;

    public List<Patient> getAllPatients(){
        return patientRepo.findAll();
    }
    public Patient getPatientById(int id){
        Optional<Patient> patient=patientRepo.findById(id);
        if(patient.isPresent()) {
            return patient.get();
        }
        return null;
    }

    public Patient createPatient(Patient patient) {
        return patientRepo.save(patient);
    }

    public Patient updatePatient(Patient patient){
        return patientRepo.save(patient);
    }

    public void deletePatientById(int id){
        patientRepo.deleteById(id);
    }

    public Patient getPatientByContact(String contact) {
        return patientRepo.findByContactNumber(contact);
    }

    public List<Patient> searchByContact(String name, String contact) {
        if (name == null || name.isEmpty()) {
            name = null;  // so query treats it as no filter on name
        }
        return patientRepo.searchByNameAndContactNumber(name, contact);
    }

    public List<Patient> searchByNameAndContact(String name, String contact) {
        return patientRepo.findByNameContainingIgnoreCaseAndContactNumberContaining(name, contact);
    }

    public List<Patient> searchByName(String name) {
        return patientRepo.findByNameContainingIgnoreCase(name);
    }

    public List<Patient> searchByContact(String contact) {
        return patientRepo.findByContactNumberContaining(contact);
    }

    public List<Patient> searchPatients(String name, String contactNumber) {
        if ((name == null || name.isEmpty()) && (contactNumber == null || contactNumber.isEmpty())) {
            // Return all patients
            return patientRepo.findAll();
        } else if (name != null && !name.isEmpty() && (contactNumber == null || contactNumber.isEmpty())) {
            return patientRepo.findByNameContainingIgnoreCase(name);
        } else if ((name == null || name.isEmpty()) && contactNumber != null && !contactNumber.isEmpty()) {
            return patientRepo.findByContactNumberContaining(contactNumber);
        } else {
            // Both provided
            return patientRepo.findByNameContainingIgnoreCaseAndContactNumberContaining(name, contactNumber);
        }
    }

}
