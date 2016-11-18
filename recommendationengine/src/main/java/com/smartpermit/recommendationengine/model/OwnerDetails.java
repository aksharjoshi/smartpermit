package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/8/16.
 */
public class OwnerDetails {

    private String OwnerId;
    private String OwnerFirstName;
    private String OwnerLastName;
    private String OwnerPhoneNumber;
    private String OwnerHouseNumber;
    private String OwnerHouseStreetName;
    private String OwnerHouseCity;
    private String OwnerHouseState;
    private int OwnerHouseZip;

    public OwnerDetails(String ownerId, String ownerFirstName, String ownerLastName, String ownerPhoneNumber, String ownerHouseNumber, String ownerHouseStreetName, String ownerHouseCity, String ownerHouseState, int ownerHouseZip) {
        OwnerId = ownerId;
        OwnerFirstName = ownerFirstName;
        OwnerLastName = ownerLastName;
        OwnerPhoneNumber = ownerPhoneNumber;
        OwnerHouseNumber = ownerHouseNumber;
        OwnerHouseStreetName = ownerHouseStreetName;
        OwnerHouseCity = ownerHouseCity;
        OwnerHouseState = ownerHouseState;
        OwnerHouseZip = ownerHouseZip;
    }

    public OwnerDetails(String ownerFirstName, String ownerLastName, String ownerPhoneNumber, String ownerHouseNumber, String ownerHouseStreetName, String ownerHouseCity, String ownerHouseState, int ownerHouseZip) {
        OwnerFirstName = ownerFirstName;
        OwnerLastName = ownerLastName;
        OwnerPhoneNumber = ownerPhoneNumber;
        OwnerHouseNumber = ownerHouseNumber;
        OwnerHouseStreetName = ownerHouseStreetName;
        OwnerHouseCity = ownerHouseCity;
        OwnerHouseState = ownerHouseState;
        OwnerHouseZip = ownerHouseZip;
    }

    public OwnerDetails() {

    }

    public String getOwnerId() {
        return OwnerId;
    }

    public void setOwnerId(String ownerId) {
        OwnerId = ownerId;
    }

    public String getOwnerFirstName() {
        return OwnerFirstName;
    }

    public void setOwnerFirstName(String ownerFirstName) {
        OwnerFirstName = ownerFirstName;
    }

    public String getOwnerLastName() {
        return OwnerLastName;
    }

    public void setOwnerLastName(String ownerLastName) {
        OwnerLastName = ownerLastName;
    }

    public String getOwnerPhoneNumber() {
        return OwnerPhoneNumber;
    }

    public void setOwnerPhoneNumber(String ownerPhoneNumber) {
        OwnerPhoneNumber = ownerPhoneNumber;
    }

    public String getOwnerHouseNumber() {
        return OwnerHouseNumber;
    }

    public void setOwnerHouseNumber(String ownerHouseNumber) {
        OwnerHouseNumber = ownerHouseNumber;
    }

    public String getOwnerHouseStreetName() {
        return OwnerHouseStreetName;
    }

    public void setOwnerHouseStreetName(String ownerHouseStreetName) {
        OwnerHouseStreetName = ownerHouseStreetName;
    }

    public String getOwnerHouseCity() {
        return OwnerHouseCity;
    }

    public void setOwnerHouseCity(String ownerHouseCity) {
        OwnerHouseCity = ownerHouseCity;
    }

    public String getOwnerHouseState() {
        return OwnerHouseState;
    }

    public void setOwnerHouseState(String ownerHouseState) {
        OwnerHouseState = ownerHouseState;
    }

    public int getOwnerHouseZip() {
        return OwnerHouseZip;
    }

    public void setOwnerHouseZip(int ownerHouseZip) {
        OwnerHouseZip = ownerHouseZip;
    }
}
