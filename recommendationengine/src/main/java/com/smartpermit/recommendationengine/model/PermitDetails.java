package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/8/16.
 */
public class PermitDetails {
    private String permitDetailsId;
    private String permitBinNumber;
    private String permitStatus;
    private String permitSequenceNumber;
    private String permitFilingStatus;
    private String permitFilingDate;
    private String permitIssuanceDate;
    private String permitExpirationDate;
    private String permitType;
    private String permitSubType;
    private String permitWorkType;
    private String permitJobType;
    private String permitJobStartDate;
    private String permitHouseNumber;
    private String permitHouseStreetName;
    private String permitBorough;
    private String permitHouseZip;
    private String permiteeId;
    private String ownerId;
    private String permitId;

    public PermitDetails(String permitBinNumber, String permitStatus, String permitSequenceNumber, String permitFilingStatus, String permitFilingDate, String permitIssuanceDate, String permitExpirationDate, String permitType, String permitSubType, String permitWorkType, String permitJobType, String permitJobStartDate, String permitHouseNumber, String permitHouseStreetName, String permitBorough, String permitHouseZip, String permiteeId, String ownerId, String permitId) {
        this.permitBinNumber = permitBinNumber;
        this.permitStatus = permitStatus;
        this.permitSequenceNumber = permitSequenceNumber;
        this.permitFilingStatus = permitFilingStatus;
        this.permitFilingDate = permitFilingDate;
        this.permitIssuanceDate = permitIssuanceDate;
        this.permitExpirationDate = permitExpirationDate;
        this.permitType = permitType;
        this.permitSubType = permitSubType;
        this.permitWorkType = permitWorkType;
        this.permitJobType = permitJobType;
        this.permitJobStartDate = permitJobStartDate;
        this.permitHouseNumber = permitHouseNumber;
        this.permitHouseStreetName = permitHouseStreetName;
        this.permitBorough = permitBorough;
        this.permitHouseZip = permitHouseZip;
        this.permiteeId = permiteeId;
        this.ownerId = ownerId;
        this.permitId = permitId;
    }


   /* public PermitDetails(String permitDetailsId, String permitBinNumber, String permitStatus, String permitSequenceNumber, String permitFilingStatus, String permitFilingDate, String permitIssuanceDate, String permitExpirationDate, String permitType, String permitSubType, String permitWorkType, String permitJobType, String permitJobStartDate, String permitHouseNumber, String permitHouseStreetName, String permitBorough, String permitHouseZip, String permiteeId, String ownerId) {
        this.permitDetailsId = permitDetailsId;
        this.permitBinNumber = permitBinNumber;
        this.permitStatus = permitStatus;
        this.permitSequenceNumber = permitSequenceNumber;
        this.permitFilingStatus = permitFilingStatus;
        this.permitFilingDate = permitFilingDate;
        this.permitIssuanceDate = permitIssuanceDate;
        this.permitExpirationDate = permitExpirationDate;
        this.permitType = permitType;
        this.permitSubType = permitSubType;
        this.permitWorkType = permitWorkType;
        this.permitJobType = permitJobType;
        this.permitJobStartDate = permitJobStartDate;
        this.permitHouseNumber = permitHouseNumber;
        this.permitHouseStreetName = permitHouseStreetName;
        this.permitBorough = permitBorough;
        this.permitHouseZip = permitHouseZip;
        this.permiteeId = permiteeId;
        this.ownerId = ownerId;
    }*/

    public PermitDetails() {
    }

    public String getPermiteeId() {
        return permiteeId;
    }

    public void setPermiteeId(String permiteeId) {
        this.permiteeId = permiteeId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getPermitDetailsId() {
        return permitDetailsId;
    }

    public void setPermitDetailsId(String permitDetailsId) {
        this.permitDetailsId = permitDetailsId;
    }

    public String getPermitBinNumber() {
        return permitBinNumber;
    }

    public void setPermitBinNumber(String permitBinNumber) {
        this.permitBinNumber = permitBinNumber;
    }

    public String getPermitStatus() {
        return permitStatus;
    }

    public void setPermitStatus(String permitStatus) {
        this.permitStatus = permitStatus;
    }

    public String getPermitSequenceNumber() {
        return permitSequenceNumber;
    }

    public void setPermitSequenceNumber(String permitSequenceNumber) {
        this.permitSequenceNumber = permitSequenceNumber;
    }

    public String getPermitFilingStatus() {
        return permitFilingStatus;
    }

    public void setPermitFilingStatus(String permitFilingStatus) {
        this.permitFilingStatus = permitFilingStatus;
    }

    public String getPermitFilingDate() {
        return permitFilingDate;
    }

    public void setPermitFilingDate(String permitFilingDate) {
        this.permitFilingDate = permitFilingDate;
    }

    public String getPermitIssuanceDate() {
        return permitIssuanceDate;
    }

    public void setPermitIssuanceDate(String permitIssuanceDate) {
        this.permitIssuanceDate = permitIssuanceDate;
    }

    public String getPermitExpirationDate() {
        return permitExpirationDate;
    }

    public void setPermitExpirationDate(String permitExpirationDate) {
        this.permitExpirationDate = permitExpirationDate;
    }

    public String getPermitType() {
        return permitType;
    }

    public void setPermitType(String permitType) {
        this.permitType = permitType;
    }

    public String getPermitSubType() {
        return permitSubType;
    }

    public void setPermitSubType(String permitSubType) {
        this.permitSubType = permitSubType;
    }

    public String getPermitWorkType() {
        return permitWorkType;
    }

    public void setPermitWorkType(String permitWorkType) {
        this.permitWorkType = permitWorkType;
    }

    public String getPermitJobType() {
        return permitJobType;
    }

    public void setPermitJobType(String permitJobType) {
        this.permitJobType = permitJobType;
    }

    public String getPermitJobStartDate() {
        return permitJobStartDate;
    }

    public void setPermitJobStartDate(String permitJobStartDate) {
        this.permitJobStartDate = permitJobStartDate;
    }

    public String getPermitHouseNumber() {
        return permitHouseNumber;
    }

    public void setPermitHouseNumber(String permitHouseNumber) {
        this.permitHouseNumber = permitHouseNumber;
    }

    public String getPermitHouseStreetName() {
        return permitHouseStreetName;
    }

    public void setPermitHouseStreetName(String permitHouseStreetName) {
        this.permitHouseStreetName = permitHouseStreetName;
    }

    public String getPermitBorough() {
        return permitBorough;
    }

    public void setPermitBorough(String permitBorough) {
        this.permitBorough = permitBorough;
    }

    public String getPermitHouseZip() {
        return permitHouseZip;
    }

    public void setPermitHouseZip(String permitHouseZip) {
        this.permitHouseZip = permitHouseZip;
    }

    public String getPermitId() {
        return permitId;
    }

    public void setPermitId(String permitId) {
        this.permitId = permitId;
    }
}
