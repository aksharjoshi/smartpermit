package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/19/16.
 */
public class OwnerPreferences {
    private long ownerId;
    private long permitId;
    private int preference;

    public OwnerPreferences(long ownerId, long permitId, int preference) {
        this.ownerId = ownerId;
        this.permitId = permitId;
        this.preference = preference;
    }

    public OwnerPreferences() {

    }

    public long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(long ownerId) {
        this.ownerId = ownerId;
    }

    public long getPermitId() {
        return permitId;
    }

    public void setPermitId(long permitId) {
        this.permitId = permitId;
    }

    public int getPreference() {
        return preference;
    }

    public void setPreference(int preference) {
        this.preference = preference;
    }
}
