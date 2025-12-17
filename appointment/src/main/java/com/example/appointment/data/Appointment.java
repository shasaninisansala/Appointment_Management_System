package com.example.appointment.data;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "doctor_id", nullable = false)
    private int doctorId;

    @Column(name = "patient_id")
    private int patientId;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "contact_number", nullable = false)
    private String patientContact;


    @Column(name = "app_date", nullable = false)
    private LocalDate appDate;

    @Column(name = "app_time", nullable = false)
    private String appTime;


    @Column(name = "app_number")
    private Integer appNumber;


    @Column(name = "app_fee", nullable = false)
    private double appFee;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "room_no")
    private int roomNo;

    public int getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(int roomNo) {
        this.roomNo = roomNo;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientContact() {
        return patientContact;
    }

    public void setPatientContact(String patientContact) {
        this.patientContact = patientContact;
    }


    public LocalDate getAppDate() {
        return appDate;
    }

    public void setAppDate(LocalDate appDate) {
        this.appDate = appDate;
    }

    public String getAppTime() {
        return appTime;
    }

    public void setAppTime(String appTime) {
        this.appTime = appTime;
    }

    public Integer getAppNumber() {
        return appNumber;
    }

    public void setAppNumber(Integer appNumber) {
        this.appNumber = appNumber;
    }

    public double getAppFee() {
        return appFee;
    }

    public void setAppFee(double appFee) {
        this.appFee = appFee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
