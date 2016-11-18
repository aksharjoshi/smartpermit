package com.smartpermit.recommendationengine.model;

import com.sun.jersey.api.client.GenericType;
import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

/**
 * Created by adwaitkaley on 11/5/16.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class InputData {
    public static final GenericType<List<InputData>> LIST_TYPE = new GenericType<List<InputData>>() {};

    final String permitBinNumber;
    final String permitStatus;
    final String permitSequenceNumber;
    final String permitFilingStatus;
    final String permitFilingDate;
    final String permitIssuanceDate;
    final String permitExpirationDate;
    final String permitType;
    final String permitSubType;
    final String permitWorkType;
    final String permitJobType;
    final String permitJobStartDate;
    final String permitHouseNumber;
    final String permitHouseStreetName;
    final String permitBorough;
    final String permitHouseZip;

    /*Permitee*/
    final String permiteeFirstName;
    final String permiteeLastName;
    final String permiteeBusinessName;
    final String permiteeLicenseNumber;
    final String permiteeLicenseType;


    /*Owner*/

    final String OwnerFirstName;
    final String OwnerLastName;
    final String OwnerPhoneNumber;
    final String OwnerHouseNumber;
    final String OwnerHouseStreetName;
    final String OwnerHouseCity;
    final String OwnerHouseState;
    final String OwnerHouseZip;


    @JsonCreator
    public InputData(@JsonProperty("bin__") String permitBinNumber,
                     @JsonProperty("permit_sequence__") String permitSequenceNumber,
                     @JsonProperty("permit_status") String permitStatus,
                     @JsonProperty("filing_status") String permitFilingStatus,
                     @JsonProperty("filing_date") String permitFilingDate,
                     @JsonProperty("issuance_date") String permitIssuanceDate,
                     @JsonProperty("expiration_date") String permitExpirationDate,
                     @JsonProperty("permit_type") String permitType,
                     @JsonProperty("permit_subtype") String permitSubType,
                     @JsonProperty("work_type") String permitWorkType,
                     @JsonProperty("job_type")  String permitJobType,
                     @JsonProperty("job_start_date") String permitJobStartDate,
                     @JsonProperty("permittee_s_first_name") String permiteeFirstName,
                     @JsonProperty("permittee_s_last_name")  String permiteeLastName,
                     @JsonProperty("permittee_s_business_name") String permiteeBusinessName,
                     @JsonProperty("permittee_s_license__")  String permiteeLicenseNumber,
                     @JsonProperty("permittee_s_license_type")  String permiteeLicenseType,
                     @JsonProperty("borough") String permitBorough,
                     @JsonProperty("owner_s_first_name")  String ownerFirstName,
                     @JsonProperty("owner_s_last_name")  String ownerLastName,
                     @JsonProperty("owner_s_phone__") String ownerPhoneNumber,
                     @JsonProperty("owner_s_house__") String ownerHouseNumber,
                     @JsonProperty("owner_s_house_street_name") String ownerHouseStreetName,
                     @JsonProperty("owner_s_zip_code") String ownerHouseZip,
                     @JsonProperty("city") String ownerHouseCity,
                     @JsonProperty("state") String ownerHouseState,
                     @JsonProperty("house__") String permitHouseNumber,
                     @JsonProperty("street_name")  String permitHouseStreetName,
                     @JsonProperty("zip_code")  String permitHouseZip) {
        this.permitBinNumber = processNullOrEmptyStrings(permitBinNumber);
        this.permitSequenceNumber = processNullOrEmptyStrings(permitSequenceNumber);
        this.permitStatus = processNullOrEmptyStrings(permitStatus);
        this.permitFilingStatus = processNullOrEmptyStrings(permitFilingStatus);
        this.permitFilingDate = processNullOrEmptyStrings(permitFilingDate);
        this.permitIssuanceDate = processNullOrEmptyStrings(permitIssuanceDate);
        this.permitExpirationDate = processNullOrEmptyStrings(permitExpirationDate);
        this.permitType = processNullOrEmptyStrings(permitType);
        this.permitSubType = processNullOrEmptyStrings(permitSubType);
        this.permitWorkType = processNullOrEmptyStrings(permitWorkType);
        this.permitJobType = processNullOrEmptyStrings(permitJobType);
        this.permitJobStartDate = processNullOrEmptyStrings(permitJobStartDate);
        this.permiteeFirstName = processNullOrEmptyStrings(permiteeFirstName);
        this.permiteeLastName = processNullOrEmptyStrings(permiteeLastName);
        this.permiteeBusinessName = processNullOrEmptyStrings(permiteeBusinessName);
        this.permiteeLicenseNumber = processNullOrEmptyStrings(permiteeLicenseNumber);
        this.permiteeLicenseType = processNullOrEmptyStrings(permiteeLicenseType);
        this.permitBorough = processNullOrEmptyStrings(permitBorough);
        this.OwnerFirstName = processNullOrEmptyStrings(ownerFirstName);
        this.OwnerLastName = processNullOrEmptyStrings(ownerLastName);
        this.OwnerPhoneNumber = processNullOrEmptyStrings(ownerPhoneNumber);
        this.OwnerHouseNumber = processNullOrEmptyStrings(ownerHouseNumber);
        this.OwnerHouseStreetName = processNullOrEmptyStrings(ownerHouseStreetName);
        this.OwnerHouseCity = processNullOrEmptyStrings(ownerHouseCity);
        this.OwnerHouseState = processNullOrEmptyStrings(ownerHouseState);
        this.OwnerHouseZip = processNullOrEmptyStrings(ownerHouseZip);
        this.permitHouseNumber = processNullOrEmptyStrings(permitHouseNumber);
        this.permitHouseStreetName = processNullOrEmptyStrings(permitHouseStreetName);
        this.permitHouseZip = processNullOrEmptyStrings(permitHouseZip);
    }

    @JsonProperty("permit_status")
    public String getPermitStatus() {
        return permitStatus;
    }

    @JsonProperty("permit_sequence__")
    public String getPermitSequenceNumber() {
        return permitSequenceNumber;
    }

    @JsonProperty("filing_status")
    public String getPermitFilingStatus() {
        return permitFilingStatus;
    }

    @JsonProperty("filing_date")
    public String getPermitFilingDate() {
        return permitFilingDate;
    }

    @JsonProperty("issuance_date")
    public String getPermitIssuanceDate() {
        return permitIssuanceDate;
    }

    @JsonProperty("expiration_date")
    public String getPermitExpirationDate() {
        return permitExpirationDate;
    }

    @JsonProperty("permit_type")
    public String getPermitType() {
        return permitType;
    }

    @JsonProperty("permit_subtype")
    public String getPermitSubType() {
        return permitSubType;
    }

    @JsonProperty("work_type")
    public String getPermitWorkType() {
        return permitWorkType;
    }

    @JsonProperty("job_type")
    public String getPermitJobType() {
        return permitJobType;
    }

    @JsonProperty("job_start_date")
    public String getPermitJobStartDate() {
        return permitJobStartDate;
    }

    @JsonProperty("permittee_s_first_name")
    public String getPermiteeFirstName() {
        return permiteeFirstName;
    }

    @JsonProperty("permittee_s_last_name")
    public String getPermiteeLastName() {
        return permiteeLastName;
    }

    @JsonProperty("permittee_s_business_name")
    public String getPermiteeBusinessName() {
        return permiteeBusinessName;
    }

    @JsonProperty("permittee_s_license__")
    public String getPermiteeLicenseNumber() {
        return permiteeLicenseNumber;
    }

    @JsonProperty("permittee_s_license_type")
    public String getPermiteeLicenseType() {
        return permiteeLicenseType;
    }

    @JsonProperty("borough")
    public String getPermitBorough() {
        return permitBorough;
    }

    @JsonProperty("owner_s_first_name")
    public String getOwnerFirstName() {
        return OwnerFirstName;
    }

    @JsonProperty("owner_s_last_name")
    public String getOwnerLastName() {
        return OwnerLastName;
    }

    @JsonProperty("owner_s_phone__")
    public String getOwnerPhoneNumber() {
        return OwnerPhoneNumber;
    }

    @JsonProperty("house__")
    public String getPermitHouseNumber() {
        return permitHouseNumber;
    }

    @JsonProperty("street_name")
    public String getPermitHouseStreetName() {
        return permitHouseStreetName;
    }

    @JsonProperty("zip_code")
    public String getPermitHouseZip() {
        return permitHouseZip;
    }

    @JsonProperty("bin__")
    public String getPermitBinNumber() {
        return permitBinNumber;
    }

    @JsonProperty("owner_s_house__")
    public String getOwnerHouseNumber() {
        return OwnerHouseNumber;
    }

    @JsonProperty("owner_s_house_street_name")
    public String getOwnerHouseStreetName() {
        return OwnerHouseStreetName;
    }

    @JsonProperty("city")
    public String getOwnerHouseCity() {
        return OwnerHouseCity;
    }

    @JsonProperty("state")
    public String getOwnerHouseState() {
        return OwnerHouseState;
    }

    @JsonProperty("owner_s_zip_code")
    public String getOwnerHouseZip() {
        return OwnerHouseZip;
    }

    @Override
    public String toString() {
        return "com.smartpermit.model.InputData{" +
                "permitBinNumber='" + permitBinNumber + '\'' +
                ", permitStatus='" + permitStatus + '\'' +
                ", permitSequenceNumber='" + permitSequenceNumber + '\'' +
                ", permitFilingStatus='" + permitFilingStatus + '\'' +
                ", permitFilingDate='" + permitFilingDate + '\'' +
                ", permitIssuanceDate='" + permitIssuanceDate + '\'' +
                ", permitExpirationDate='" + permitExpirationDate + '\'' +
                ", permitType='" + permitType + '\'' +
                ", permitSubType='" + permitSubType + '\'' +
                ", permitWorkType='" + permitWorkType + '\'' +
                ", permitJobType='" + permitJobType + '\'' +
                ", permitJobStartDate='" + permitJobStartDate + '\'' +
                ", permitHouseNumber='" + permitHouseNumber + '\'' +
                ", permitHouseStreetName='" + permitHouseStreetName + '\'' +
                ", permitBorough='" + permitBorough + '\'' +
                ", permitHouseZip='" + permitHouseZip + '\'' +
                ", permiteeFirstName='" + permiteeFirstName + '\'' +
                ", permiteeLastName='" + permiteeLastName + '\'' +
                ", permiteeBusinessName='" + permiteeBusinessName + '\'' +
                ", permiteeLicenseNumber='" + permiteeLicenseNumber + '\'' +
                ", permiteeLicenseType='" + permiteeLicenseType + '\'' +
                ", OwnerFirstName='" + OwnerFirstName + '\'' +
                ", OwnerLastName='" + OwnerLastName + '\'' +
                ", OwnerPhoneNumber='" + OwnerPhoneNumber + '\'' +
                ", OwnerHouseNumber='" + OwnerHouseNumber + '\'' +
                ", OwnerHouseStreetName='" + OwnerHouseStreetName + '\'' +
                ", OwnerHouseCity='" + OwnerHouseCity + '\'' +
                ", OwnerHouseState='" + OwnerHouseState + '\'' +
                ", OwnerHouseZip='" + OwnerHouseZip + '\'' +
                '}';
    }

    public String processNullOrEmptyStrings(String str){
        String finalString ="N/A";
        if(str != null){
            str = str.trim();
            str = str.replaceAll(","," ");
            str = str.replaceAll(" +"," ");
            if(str.trim().length() == 0) {
                finalString = "N/A";
            } else {
                finalString = str.toUpperCase();
            }
        }
        return  finalString;
    }
}
