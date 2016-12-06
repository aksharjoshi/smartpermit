package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 12/5/16.
 */
public class RecoMaster {
    int id;
    int permitId;
    int recoId;

    public RecoMaster() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPermitId() {
        return permitId;
    }

    public void setPermitId(int permitId) {
        this.permitId = permitId;
    }

    public int getRecoId() {
        return recoId;
    }

    public void setRecoId(int recoId) {
        this.recoId = recoId;
    }
}
