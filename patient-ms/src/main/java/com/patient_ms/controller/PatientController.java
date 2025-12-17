package com.patient_ms.controller;

import com.patient_ms.data.Patient;
import com.patient_ms.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping(path = "/patients")
    public List<Patient> getAllPatients(){
        return patientService.getAllPatients();
    }
    @GetMapping(path = "/{id}")
    public Patient getPatientById(@PathVariable int id){
        return patientService.getPatientById(id);
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @PutMapping(path = "/{id}")
    public Patient updatePatient(@PathVariable int id, @RequestBody Patient patient) {
        patient.setId(id);
        return patientService.updatePatient(patient);
    }


    @DeleteMapping(path = "/{id}")
    public void deletePatient(@PathVariable int id){
        patientService.deletePatientById(id);

    }

    @GetMapping
    public List<Patient> searchPatients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String contact) {

        if (name != null && contact != null) {
            return patientService.searchByNameAndContact(name, contact);
        } else if (name != null) {
            return patientService.searchByName(name);
        } else if (contact != null) {
            return patientService.searchByContact(contact);
        } else {
            return patientService.getAllPatients();
        }
    }




    // Get single patient by contact number
    @GetMapping("/contact/{contact}")
    public ResponseEntity<Patient> getPatientByContact(@PathVariable String contact) {
        Patient patient = patientService.getPatientByContact(contact);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    }


