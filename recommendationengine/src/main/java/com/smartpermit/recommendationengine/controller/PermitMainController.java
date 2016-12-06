package com.smartpermit.recommendationengine.controller;

import com.smartpermit.recommendationengine.model.Acronym;
import com.smartpermit.recommendationengine.model.OwnerPreferences;
import com.smartpermit.recommendationengine.model.Permit;
import com.smartpermit.recommendationengine.recommender.Recommender;
import com.smartpermit.recommendationengine.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
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
    PermitRepository permitRepository;
    @Autowired
    Recommender recommenderImpl;
    @Autowired
    AcronymMasterRepository acronymRepository;
    @Autowired
    RecoRepository recoRepository;

    public void setRecommenderImpl(Recommender recommenderImpl) {
        this.recommenderImpl = recommenderImpl;
    }

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

    @RequestMapping(value = "/recommend", method = RequestMethod.POST)
    public ResponseEntity recommendDataForMultiplePermits(@RequestBody List<Permit> permitList) {

        HashMap<String,Permit> permitHashMap = new HashMap<>();
        ArrayList<Permit> filteredPermitList = new ArrayList<>();
        HashMap<String,String> hashMap = getAcronymMap();

        for(Permit permit : permitList){
            int permitId = permitRepository.findPermitId(permit.getPermitJobType(),permit.getPermitType(),permit.getPermitSubtype());
            List<Integer> recommendedPermitIds = recoRepository.findAllRecommendationsByPermitId(permitId);
            List<Permit> recommendations = new ArrayList<>();
            for(int i : recommendedPermitIds){
               Permit recoPermit = permitRepository.findPermitbyId(i);
                recoPermit.setPermitJobTypeDescription(hashMap.get(recoPermit.getPermitJobType()));
                recoPermit.setPermitTypeDescription(hashMap.get(recoPermit.getPermitType()));
                recoPermit.setPermitSubtypeDescription(hashMap.get(recoPermit.getPermitSubtype()));
                recommendations.add(recoPermit);
            }
            for(Permit recommendedPermit : recommendations){
                if(!permitHashMap.containsKey(recommendedPermit.getPermitId())){
                    permitHashMap.put(recommendedPermit.getPermitId(),recommendedPermit);
                    filteredPermitList.add(recommendedPermit);
                }
            }
        }


        if(!filteredPermitList.isEmpty()){
            return new ResponseEntity(filteredPermitList,HttpStatus.OK);
        }
        return new ResponseEntity(new HashMap<String,String>(){{put("Message","Unable to Generate Recommendations");}}, HttpStatus.NOT_FOUND);
    }
    private HashMap getAcronymMap() {
        HashMap<String,String> hashmap = new HashMap<>();
        List<Acronym> acronymList = acronymRepository.findAllAcronymDescriptions();
        for(Acronym acronym : acronymList){
            hashmap.put(acronym.getAcronym(),acronym.getDescription());
        }
        return hashmap;
    }
}
