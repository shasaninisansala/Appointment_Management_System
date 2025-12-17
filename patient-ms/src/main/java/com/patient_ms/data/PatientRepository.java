package com.patient_ms.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    // Find single patient by exact contact number
    Patient findByContactNumber(String contactNumber);

    // Search patients by name (partial match) and contact number (exact match)
    @Query("SELECT p FROM Patient p WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) "
            + "AND (:contactNumber IS NULL OR p.contactNumber = :contactNumber)")
    List<Patient> searchByNameAndContactNumber(@Param("name") String name, @Param("contactNumber") String contactNumber);

    // Use correct field names in method names:
    List<Patient> findByNameContainingIgnoreCaseAndContactNumberContaining(String name, String contactNumber);

    List<Patient> findByNameContainingIgnoreCase(String name);

    List<Patient> findByContactNumberContaining(String contactNumber);
}

