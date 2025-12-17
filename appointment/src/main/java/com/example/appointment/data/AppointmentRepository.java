package com.example.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {


    List<Appointment> findByDoctorIdAndAppDate(int doctorId, LocalDate appDate);


    List<Appointment> findByDoctorIdAndAppDateOrderByAppNumberDesc(int doctorId, LocalDate appDate); // ✅

    @Query("SELECT MAX(a.appNumber) FROM Appointment a WHERE a.appDate = :date AND a.doctorId = :doctorId")
    Integer findMaxAppNumberByDateAndDoctor(@Param("date") LocalDate date, @Param("doctorId") int doctorId); // ✅

    // In AppointmentRepository.java

    @Query("SELECT COALESCE(MAX(a.appNumber), 0) FROM Appointment a WHERE a.doctorId = :doctorId AND a.appDate = :appDate")
    int findMaxAppNumberByDoctorIdAndAppDate(@Param("doctorId") int doctorId, @Param("appDate") LocalDate appDate);



    List<Appointment> findByAppDate(LocalDate appDate);

    List<Appointment> findByDoctorId(Integer doctorId);

    List<Appointment> findByDoctorId(int doctorId);


}
