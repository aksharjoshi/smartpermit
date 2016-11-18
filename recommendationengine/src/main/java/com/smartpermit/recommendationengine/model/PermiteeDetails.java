package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/8/16.
 */
public class PermiteeDetails {

    private String permiteeId;
    private String permiteeFirstName;
    private String permiteeLastName;
    private String permiteeBusinessName;
    private String permiteeLicenseNumber;
    private String permiteeLicenseType;

    public PermiteeDetails(String permiteeId, String permiteeFirstName, String permiteeLastName, String permiteeBusinessName, String permiteeLicenseNumber, String permiteeLicenseType) {
        this.permiteeId = permiteeId;
        this.permiteeFirstName = permiteeFirstName;
        this.permiteeLastName = permiteeLastName;
        this.permiteeBusinessName = permiteeBusinessName;
        this.permiteeLicenseNumber = permiteeLicenseNumber;
        this.permiteeLicenseType = permiteeLicenseType;
    }

    public PermiteeDetails(String permiteeFirstName, String permiteeLastName, String permiteeBusinessName, String permiteeLicenseNumber, String permiteeLicenseType) {
        this.permiteeFirstName = permiteeFirstName;
        this.permiteeLastName = permiteeLastName;
        this.permiteeBusinessName = permiteeBusinessName;
        this.permiteeLicenseNumber = permiteeLicenseNumber;
        this.permiteeLicenseType = permiteeLicenseType;
    }

    public PermiteeDetails() {

    }

    public String getPermiteeId() {
        return permiteeId;
    }

    public void setPermiteeId(String permiteeId) {
        this.permiteeId = permiteeId;
    }

    public String getPermiteeFirstName() {
        return permiteeFirstName;
    }

    public void setPermiteeFirstName(String permiteeFirstName) {
        this.permiteeFirstName = permiteeFirstName;
    }

    public String getPermiteeLastName() {
        return permiteeLastName;
    }

    public void setPermiteeLastName(String permiteeLastName) {
        this.permiteeLastName = permiteeLastName;
    }

    public String getPermiteeBusinessName() {
        return permiteeBusinessName;
    }

    public void setPermiteeBusinessName(String permiteeBusinessName) {
        this.permiteeBusinessName = permiteeBusinessName;
    }

    public String getPermiteeLicenseNumber() {
        return permiteeLicenseNumber;
    }

    public void setPermiteeLicenseNumber(String permiteeLicenseNumber) {
        this.permiteeLicenseNumber = permiteeLicenseNumber;
    }

    public String getPermiteeLicenseType() {
        return permiteeLicenseType;
    }

    public void setPermiteeLicenseType(String permiteeLicenseType) {
        this.permiteeLicenseType = permiteeLicenseType;
    }
}
