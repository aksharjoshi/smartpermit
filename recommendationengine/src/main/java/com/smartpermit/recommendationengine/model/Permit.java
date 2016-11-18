package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/14/16.
 */
public class Permit {

    private String permitId;
    private String permitJobType;
    private String permitType;
    private String permitSubtype;


    public Permit() {
    }

    public Permit(String permitJobType, String permitType, String permitSubtype) {
        this.permitJobType = permitJobType;
        this.permitType = permitType;
        this.permitSubtype = permitSubtype;
    }

    public String getPermitId() {
        return permitId;
    }

    public void setPermitId(String permitId) {
        this.permitId = permitId;
    }

    public String getPermitJobType() {
        return permitJobType;
    }

    public void setPermitJobType(String permitJobType) {
        this.permitJobType = permitJobType;
    }

    public String getPermitType() {
        return permitType;
    }

    public void setPermitType(String permitType) {
        this.permitType = permitType;
    }

    public String getPermitSubtype() {
        return permitSubtype;
    }

    public void setPermitSubtype(String permitSubtype) {
        this.permitSubtype = permitSubtype;
    }
}
