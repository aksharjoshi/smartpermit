package com.smartpermit.recommendationengine.controller;

import com.smartpermit.recommendationengine.model.OwnerPreferences;
import com.smartpermit.recommendationengine.model.Permit;
import com.smartpermit.recommendationengine.recommender.Recommender;
import com.smartpermit.recommendationengine.repositories.OwnerPreferencesRepository;
import com.smartpermit.recommendationengine.repositories.PermitDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;

/**
 * Created by adwaitkaley on 11/10/16.
 */
@Controller
public class PermitMainController {
    @Autowired
    DataController dataController;
    @Autowired
    PermitDetailsRepository permitDetailsRepository;
    @Autowired
    OwnerPreferencesRepository ownerPreferencesRepository;
    @Autowired
    Recommender recommenderImpl;

    @RequestMapping(value = "/recommend", method = RequestMethod.GET)
    public ResponseEntity recommendData(@RequestParam("permitId") String permitId, @RequestParam("count") int count) {
        List<Permit> permitList = recommenderImpl.getRecommendations(permitId, count);
        if(permitList != null){
            return new ResponseEntity(permitList,HttpStatus.OK);
        }
        return new ResponseEntity(new HashMap<String,String>(){{put("Message","Unable to Generate Recommendations");}}, HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public ResponseEntity restData(@RequestParam("offset") int offset, @RequestParam("limit") final int limit, @RequestParam("size") int size){
        boolean dataStatus = dataController.populateData(offset,limit,size);
        if(dataStatus){
            return new ResponseEntity(new HashMap<String,String>(){{put("Message"," "+limit+" records processed successfully");}}, HttpStatus.OK);
        }
        return new ResponseEntity(new HashMap<String,String>(){{put("Message","Something went wrong on the server");}}, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/evaluate", method = RequestMethod.GET)
    public ResponseEntity evaluatePermitRecommender() {
        HashMap hashMap = recommenderImpl.evaluate();
        if(hashMap.isEmpty()){
            return new ResponseEntity(new HashMap<String,String>(){{put("Message","Unable to generate evaluations");}}, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(recommenderImpl.evaluate(), HttpStatus.OK);
    }

    @RequestMapping(value = "/build", method = RequestMethod.GET)
    public ResponseEntity buildDataModel() {
        HashMap<String, List<String>> ownerPermitMap = permitDetailsRepository.findAllOwnersAndPermits();
        if(ownerPermitMap.isEmpty()){
            return new ResponseEntity(new HashMap<String,String>(){{put("Message","Data Unavailable");}}, HttpStatus.NOT_FOUND);
        }
        for (String ownerId : ownerPermitMap.keySet()) {
            List<String> permitIdsList = ownerPermitMap.get(ownerId);
            for (String permitId : permitIdsList) {
                long longOwner = Long.valueOf(ownerId);
                long longPermit = Long.valueOf(permitId);
                if (ownerPreferencesRepository.findOwnerPreferenceById(longOwner, longPermit) == null) {
                    ownerPreferencesRepository.create(new OwnerPreferences(longOwner, longPermit, 1));
                } else {
                    ownerPreferencesRepository.incrementPreferencecount(longOwner, longPermit);
                }
            }
        }
        return new ResponseEntity(new HashMap<String,String>(){{put("Message","Data Model Generated");}}, HttpStatus.OK);
    }
}
