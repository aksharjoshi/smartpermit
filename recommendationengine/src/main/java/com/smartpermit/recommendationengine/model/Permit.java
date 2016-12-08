package com.smartpermit.recommendationengine.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

/**
 * Created by adwaitkaley on 11/14/16.
 */
public class Permit {

    private String permitId;
    private String permitJobType;
    private String permitType;
    private String permitSubtype;
    private String permitJobTypeDescription;
    private String permitTypeDescription;
    private String permitSubtypeDescription;


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

    public String getPermitJobTypeDescription() {
        return permitJobTypeDescription;
    }

    public void setPermitJobTypeDescription(String permitJobTypeDescription) {
        this.permitJobTypeDescription = permitJobTypeDescription;
    }

    public String getPermitTypeDescription() {
        return permitTypeDescription;
    }

    public void setPermitTypeDescription(String permitTypeDescription) {
        this.permitTypeDescription = permitTypeDescription;
    }

    public String getPermitSubtypeDescription() {
        return permitSubtypeDescription;
    }

    public void setPermitSubtypeDescription(String permitSubtypeDescription) {
        this.permitSubtypeDescription = permitSubtypeDescription;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass()) return false;

        Permit permit = (Permit) o;

        return new EqualsBuilder()
                .append(permitJobType, permit.permitJobType)
                .append(permitType, permit.permitType)
                .append(permitSubtype, permit.permitSubtype)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(permitJobType)
                .append(permitType)
                .append(permitSubtype)
                .toHashCode();
    }
}
