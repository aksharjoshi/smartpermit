package com.smartpermit.recommendationengine.model;

/**
 * Created by adwaitkaley on 11/28/16.
 */
public class Acronym {
    private String id;
    private String acronym;
    private String description;

    public Acronym() {
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
